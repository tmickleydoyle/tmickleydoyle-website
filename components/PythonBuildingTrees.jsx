import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";

SyntaxHighlighter.registerLanguage("python", python);

export default function BinaryTreeDisplay() {

  const pythonCode = `class Node:
    def __init__(self, key):
        """
        Initializes a new node with the specified key.

        Args:
            key (int): The value of the node.
        """
        self.left = None
        self.right = None
        self.val = key

    def insert_at_path(self, path, key):
        """
        Inserts a new node with the specified key at the given path.

        Args:
            path (list of tuples): The path to the insertion point. Each tuple contains a direction ('left' or 'right') and a parent value.
            key (int): The value of the new node to insert.

        Raises:
            ValueError: If the parent value in the path does not match the current node's value.
        """
        current = self
        for direction, parent_value in path[:-1]:
            if parent_value == current.val:
                if direction == 'left':
                    if current.left is None:
                        current.left = Node(None)
                    current = current.left
                elif direction == 'right':
                    if current.right is None:
                        current.right = Node(None)
                    current = current.right
            else:
                raise ValueError(f"Value {parent_value} does not match current value {current.val}")
        
        direction, parent_value = path[-1]
        if parent_value == current.val:
            if direction == 'left':
                current.left = Node(key)
            elif direction == 'right':
                current.right = Node(key)
        else:
            raise ValueError(f"Value {parent_value} does not match current value {current.val}")

    def __str__(self, level=0, prefix="Root: "):
        """
        Returns a string representation of the tree for easy visualization.

        Args:
            level (int, optional): The current tree level (depth). Defaults to 0.
            prefix (str, optional): The prefix for the current level. Defaults to "Root: ".

        Returns:
            str: The string representation of the tree.
        """
        ret = " " * (level*4) + prefix + str(self.val) + "\n"
        if self.left:
            ret += self.left.__str__(level + 1, "L--- ")
        if self.right:
            ret += self.right.__str__(level + 1, "R--- ")
        return ret
    
def printInorder(root):
    if root:
        printInorder(root.left)
        print(root.val),
        printInorder(root.right)

def printPostorder(root):
    if root:
        printPostorder(root.left)
        printPostorder(root.right)
        print(root.val),

def printPreorder(root):
    if root:
        print(root.val),
        printPreorder(root.left)
        printPreorder(root.right)
    
if __name__ == "__main__":
    root = Node(1)
    root.insert_at_path([('right', 1)], 2)
    root.insert_at_path([('left', 1)], 3)
    root.insert_at_path([('right', 1), ('right', 2)], 4)
    root.insert_at_path([('right', 1), ('left', 2)], 5)
    root.insert_at_path([('left', 1), ('left', 3)], 6)
    root.insert_at_path([('left', 1), ('right', 3)], 7)
    root.insert_at_path([('right', 1), ('right', 2), ('left', 4)], 8)
    root.insert_at_path([('right', 1), ('right', 2), ('right', 4)], 9)
    root.insert_at_path([('right', 1), ('left', 2), ('left', 5)], 10)
    root.insert_at_path([('right', 1), ('left', 2), ('right', 5)], 11)
    root.insert_at_path([('left', 1), ('left', 3), ('left', 6)], 12)
    root.insert_at_path([('left', 1), ('left', 3), ('right', 6)], 13)
    root.insert_at_path([('left', 1), ('right', 3), ('left', 7)], 14)
    root.insert_at_path([('left', 1), ('right', 3), ('right', 7)], 15)

    print("Show tree:")
    print(root)

    print("Inorder traversal:")
    printInorder(root)

    print("Preorder traversal:")
    printPreorder(root)

    print("Postorder traversal:")
    printPostorder(root)
`;

  const codeOutput = `
Show tree:
Root: 1
    L--- 3
        L--- 6
            L--- 12
            R--- 13
        R--- 7
            L--- 14
            R--- 15
    R--- 2
        L--- 5
            L--- 10
            R--- 11
        R--- 4
            L--- 8
            R--- 9

Inorder traversal:
12
6
13
3
14
7
15
1
10
5
11
2
8
4
9
Preorder traversal:
1
3
6
12
13
7
14
15
2
5
10
11
4
8
9
Postorder traversal:
12
13
6
14
15
7
3
10
11
5
8
9
4
2
1
`;


  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1>Tree Implementation with Deep Paths</h1>
      <div className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-4">
        <SyntaxHighlighter
          language="python"
          style={github}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent",
          }}
        >
          {pythonCode}
        </SyntaxHighlighter>
      </div>
      <h3 className="text-md font-semibold mb-2">Output:</h3>
      <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
        <SyntaxHighlighter
          language="python"
          style={github}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent",
          }}
        >
          {codeOutput}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
