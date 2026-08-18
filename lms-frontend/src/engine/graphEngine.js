/**
 * Graph Engine
 * Handles all deterministic operations on the Capability DAG
 */

export const getDownstreamNodes = (graph, skillId) => {
  const node = graph.nodes[skillId];
  if (!node) return [];
  
  let downstream = [...node.unlocks];
  
  // Recursively find all downstream nodes
  for (const nextId of node.unlocks) {
    const furtherDown = getDownstreamNodes(graph, nextId);
    downstream = [...new Set([...downstream, ...furtherDown])];
  }
  
  return downstream;
};

export const getUpstreamNodes = (graph, skillId) => {
  const node = graph.nodes[skillId];
  if (!node) return [];
  
  let upstream = [...node.prerequisites];
  
  for (const prevId of node.prerequisites) {
    const furtherUp = getUpstreamNodes(graph, prevId);
    upstream = [...new Set([...upstream, ...furtherUp])];
  }
  
  return upstream;
};

export const topologicalSort = (graph) => {
  const nodes = Object.values(graph.nodes);
  const visited = new Set();
  const temp = new Set();
  const order = [];

  const visit = (node) => {
    if (temp.has(node.id)) throw new Error(`Cycle detected at ${node.id}`);
    if (!visited.has(node.id)) {
      temp.add(node.id);
      for (const reqId of node.prerequisites) {
        visit(graph.nodes[reqId]);
      }
      visited.add(node.id);
      temp.delete(node.id);
      order.push(node.id);
    }
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      visit(node);
    }
  }

  return order;
};

export const validatePathDependencies = (graph, path) => {
  // Returns true if every node in the path appears AFTER all its prerequisites
  const seen = new Set();
  
  for (const skillId of path) {
    const node = graph.nodes[skillId];
    if (node) {
      for (const reqId of node.prerequisites) {
        // If the path contains the prerequisite, it MUST have been seen already
        if (path.includes(reqId) && !seen.has(reqId)) {
          return { valid: false, reason: `${skillId} requires ${reqId} to be completed first.` };
        }
      }
    }
    seen.add(skillId);
  }
  
  return { valid: true };
};
