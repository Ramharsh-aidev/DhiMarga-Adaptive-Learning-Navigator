from typing import List, Dict, Set
from collections import deque
import logging

logger = logging.getLogger(__name__)

class DeterministicGraphWorker:
    def get_topological_sort(self, nodes: List[dict]) -> List[int]:
        """
        Executes a deterministic Kahn's topological sort on the capability graph.
        Guarantees that prerequisite order is strictly enforced before sending to Gemini.
        """
        in_degree = {node['id']: 0 for node in nodes}
        adj_list = {node['id']: [] for node in nodes}
        
        # Build graph
        for node in nodes:
            for prereq in node.get('prerequisite_ids', []):
                # Only add if the prerequisite is in the provided subgraph
                if prereq in adj_list:
                    adj_list[prereq].append(node['id'])
                    in_degree[node['id']] += 1

        # Queue for nodes with no prerequisites
        zero_in_degree = sorted([n for n in in_degree if in_degree[n] == 0])
        queue = deque(zero_in_degree)
        
        sorted_order = []
        
        while queue:
            current = queue.popleft()
            sorted_order.append(current)
            
            neighbors_to_add = []
            for neighbor in adj_list.get(current, []):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    neighbors_to_add.append(neighbor)
            
            # Sort neighbors numerically to maintain strictly deterministic behavior
            neighbors_to_add.sort()
            for n in neighbors_to_add:
                queue.append(n)
                
        if len(sorted_order) != len(nodes):
            logger.warning("Cycle detected in DhiMarga Capability Graph! Topological sort incomplete.")
            
        return sorted_order

    def filter_available_nodes(self, nodes: List[dict], completed_nodes: Set[int]) -> List[dict]:
        """ Identifies which nodes are strictly unlocked based on the user's completed nodes """
        unlocked = []
        for node in nodes:
            if node['id'] in completed_nodes:
                continue
                
            prereqs = set(node.get('prerequisite_ids', []))
            if prereqs.issubset(completed_nodes):
                unlocked.append(node)
                
        return unlocked
