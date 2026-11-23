"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { getActiveIntegrations, DbIntegration } from "@/lib/data/integrations";

export interface DynamicIntegrationsProps {
  placement: "head" | "body_start" | "body_end";
}

/**
 * Checks whether the current URL pathname matches the integration's target_pages list.
 */
function isPathMatching(targetPages: string[], pathname: string): boolean {
  if (!Array.isArray(targetPages) || targetPages.length === 0) return true;
  if (targetPages.includes("*")) return true;

  return targetPages.some((target) => {
    const trimmed = target.trim();
    if (trimmed === "*") return true;
    if (trimmed === pathname) return true;
    if (trimmed !== "/" && pathname.startsWith(trimmed)) return true;
    return false;
  });
}

/**
 * Extracts and injects scripts and meta tags into the live DOM so they actually execute.
 * Browsers do NOT execute <script> tags inserted via innerHTML.
 * This helper creates real HTMLScriptElement and HTMLMetaElement instances.
 */
function injectSnippet(
  id: string,
  html: string,
  placement: "head" | "body_start" | "body_end"
): () => void {
  const containerId = `mc-integration-${placement}-${id}`;
  // Remove existing injection if any
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    existingContainer.remove();
  }

  const container = document.createElement("div");
  container.id = containerId;
  container.setAttribute("data-mc-integration", id);
  container.setAttribute("data-mc-placement", placement);
  container.style.display = "none";

  // Parse HTML string into DOM nodes
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Collect all elements from both head and body of the parsed document
  const parsedNodes = Array.from(doc.head.children).concat(Array.from(doc.body.children));

  parsedNodes.forEach((node) => {
    if (node.tagName.toLowerCase() === "script") {
      const scriptEl = document.createElement("script");
      const srcScript = node as HTMLScriptElement;

      // Copy all attributes (src, async, defer, type, id, etc.)
      Array.from(srcScript.attributes).forEach((attr) => {
        scriptEl.setAttribute(attr.name, attr.value);
      });

      // Copy inline code
      if (srcScript.textContent) {
        scriptEl.textContent = srcScript.textContent;
      }

      container.appendChild(scriptEl);
    } else if (node.tagName.toLowerCase() === "meta") {
      const metaEl = document.createElement("meta");
      Array.from(node.attributes).forEach((attr) => {
        metaEl.setAttribute(attr.name, attr.value);
      });
      container.appendChild(metaEl);
    } else {
      // Other tags (link, noscript, div, img, etc.)
      const clone = node.cloneNode(true);
      container.appendChild(clone);
    }
  });

  // Attach container to proper DOM location
  if (placement === "head") {
    document.head.appendChild(container);
  } else if (placement === "body_start") {
    if (document.body.firstChild) {
      document.body.insertBefore(container, document.body.firstChild);
    } else {
      document.body.appendChild(container);
    }
  } else {
    document.body.appendChild(container);
  }

  // Cleanup function
  return () => {
    const el = document.getElementById(containerId);
    if (el) el.remove();
  };
}

export function DynamicIntegrations({ placement }: DynamicIntegrationsProps) {
  const pathname = usePathname();
  const [integrations, setIntegrations] = useState<DbIntegration[]>([]);
  const cleanupRefs = useRef<Array<() => void>>([]);

  // 1. Fetch active approved integrations once on mount
  useEffect(() => {
    let isMounted = true;
    getActiveIntegrations().then((list) => {
      if (isMounted) {
        setIntegrations(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Strict Security & Injection logic: Re-evaluate whenever integrations or pathname change
  useEffect(() => {
    // ALWAYS clean up previously injected scripts first
    cleanupRefs.current.forEach((clean) => {
      try {
        clean();
      } catch (e) {
        console.warn("[DynamicIntegrations] Cleanup warning:", e);
      }
    });
    cleanupRefs.current = [];

    // CRITICAL SECURITY CONSTRAINT:
    // NEVER inject ANY tracking or third-party code inside the admin dashboard (/admin/*)
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    // Filter integrations matching this component's placement and current pathname
    const matching = integrations.filter((item) => {
      if (item.placement !== placement) return false;
      if (!item.is_active || !item.is_approved) return false;
      return isPathMatching(item.target_pages, pathname);
    });

    // Execute real DOM injection
    matching.forEach((item) => {
      try {
        const cleanup = injectSnippet(item.id, item.code_content, placement);
        cleanupRefs.current.push(cleanup);
      } catch (err) {
        console.error(`[DynamicIntegrations] Error injecting integration "${item.name}":`, err);
      }
    });

    return () => {
      cleanupRefs.current.forEach((clean) => {
        try {
          clean();
        } catch (e) {
          console.warn("[DynamicIntegrations] Unmount cleanup warning:", e);
        }
      });
      cleanupRefs.current = [];
    };
  }, [integrations, pathname, placement]);

  // Renders nothing in React DOM to prevent any Hydration mismatch
  return null;
}
