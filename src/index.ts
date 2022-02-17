// No doubt half the type annotations in this file are wrong;
// hence the frequent abuse of ["attribute"] accessors.

import { Application, Comment, CommentTag, Context, Converter, DeclarationReflection } from "typedoc";
import { Node } from "typescript";

export function load (app: Application) {

  function applyFileCategory(_ctx: Context, refl: DeclarationReflection, node: Node) {
    if (!node) return;

    const moduleCategory = getModuleCategory(node);

    if (moduleCategory && !nodeHasCategory(node)) {
      refl.comment = refl.comment || new Comment();
      if (refl.comment.tags.filter(t => t.tagName == "category").length == 0) {
        refl.comment.tags.push(
          new CommentTag("category", undefined, moduleCategory)
        );
      }
    }
  }

  app.converter.on(Converter.EVENT_CREATE_DECLARATION, applyFileCategory);
};

function nodeHasCategory(node: Node) {
  if (node["jsDoc"]?.length) {
    for (let doc of node["jsDoc"]) {
      // Get category tags only if it's not a module doc
      if (doc["tags"]?.filter(t => t.tagName.escapedText == "module").length == 0 &&
        doc["tags"]?.filter(t => t.tagName.escapedText == "category").length > 0) {
          return true;
      }
    }
  }
  return false;
}

function getModuleCategory(node: Node) {
  const sourceFile = getSourceFile(node);
  if (sourceFile) {
    const firstChildDoc = sourceFile["nextContainer"]?.["jsDoc"];
    if (firstChildDoc?.length) {
      for (let doc of firstChildDoc) {
        if (doc["tags"]?.filter(t => t.tagName.escapedText == "module").length &&
              doc["tags"]?.filter(t => t.tagName.escapedText == "category").length) {
                return doc["tags"]?.filter(t => t.tagName.escapedText == "category")[0].comment;
        }
      }
    }
  }
}

function getSourceFile(node: Node): Node | null {
  if (node["fileName"]) {
    return node;
  } else if (node.parent) {
    return getSourceFile(node.parent);
  }
  return null;
}
