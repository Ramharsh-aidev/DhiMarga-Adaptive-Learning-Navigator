-- Capability Graphs Seed Data

INSERT INTO capability_graph (id, slug, name, description, is_active, created_at, updated_at) VALUES
('6ae31f9e-6772-4170-885f-6d6c5f656e67', 'ml_engineer', 'ML Engineer', 'ML Engineer Path', true, NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1a3ddae4-6e6f-4465-8f6d-6c5f656e6769', id, 'python_fundamentals', 'Python Fundamentals', 'Programming', 70, 0.9, 0.9, 1, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1fdaf976-6e6f-4465-8f6d-6c5f656e6769', id, 'python_for_data', 'Python for Data (NumPy, Pandas)', 'Programming', 70, 0.9, 0.9, 2, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7f54afb8-6e6f-4465-8f6d-6c5f656e6769', id, 'software_engineering', 'Software Engineering (Git, Testing)', 'Programming', 60, 0.7, 0.6, 3, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '74a0ea65-6e6f-4465-8f6d-6c5f656e6769', id, 'linear_algebra', 'Linear Algebra', 'Mathematics', 65, 0.8, 0.7, 4, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4bd15569-6e6f-4465-8f6d-6c5f656e6769', id, 'calculus', 'Calculus (Derivatives, Gradients)', 'Mathematics', 60, 0.7, 0.6, 5, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1e8a57f4-6e6f-4465-8f6d-6c5f656e6769', id, 'statistics_basics', 'Descriptive Statistics', 'Mathematics', 65, 0.8, 0.9, 6, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '13b05638-6e6f-4465-8f6d-6c5f656e6769', id, 'probability', 'Probability', 'Mathematics', 65, 0.9, 0.95, 7, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '77617514-6e6f-4465-8f6d-6c5f656e6769', id, 'sql_fundamentals', 'SQL Fundamentals', 'Data', 60, 0.7, 0.6, 8, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '68b9c831-6e6f-4465-8f6d-6c5f656e6769', id, 'data_preparation', 'Data Preparation & Feature Eng', 'Data', 70, 0.9, 0.9, 9, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '15eba90d-6e6f-4465-8f6d-6c5f656e6769', id, 'ml_foundations', 'ML Foundations Overview', 'Machine Learning', 70, 0.9, 0.9, 10, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '04468fb2-6e6f-4465-8f6d-6c5f656e6769', id, 'regression', 'Regression', 'Machine Learning', 70, 0.9, 0.85, 11, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '73f4aa8d-6e6f-4465-8f6d-6c5f656e6769', id, 'classification', 'Classification', 'Machine Learning', 70, 0.9, 0.85, 12, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4aab844b-6e6f-4465-8f6d-6c5f656e6769', id, 'clustering', 'Unsupervised Learning (Clustering)', 'Machine Learning', 60, 0.7, 0.6, 13, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '320df05f-6e6f-4465-8f6d-6c5f656e6769', id, 'model_evaluation', 'Model Evaluation', 'Machine Learning', 65, 0.95, 0.9, 14, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '5adfeb08-6e6f-4465-8f6d-6c5f656e6769', id, 'gradient_descent', 'Gradient Descent', 'Machine Learning', 65, 0.8, 0.8, 15, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '737b4230-6e6f-4465-8f6d-6c5f656e6769', id, 'model_optimization', 'Model Optimization', 'Machine Learning', 65, 0.8, 0.7, 16, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '27fb7298-6e6f-4465-8f6d-6c5f656e6769', id, 'neural_networks', 'Neural Network Fundamentals', 'Deep Learning', 60, 0.8, 0.8, 17, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4b34e93d-6e6f-4465-8f6d-6c5f656e6769', id, 'cnns', 'CNNs (Computer Vision)', 'Deep Learning', 55, 0.6, 0.3, 18, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4b3bbace-6e6f-4465-8f6d-6c5f656e6769', id, 'rnns', 'RNNs / LSTMs', 'Deep Learning', 55, 0.6, 0.3, 19, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7f9e7747-6e6f-4465-8f6d-6c5f656e6769', id, 'transformers', 'Transformers', 'Deep Learning', 60, 0.8, 0.7, 20, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4a8396b2-6e6f-4465-8f6d-6c5f656e6769', id, 'generative_ai', 'Generative AI & LLMs (RAG)', 'Generative AI', 60, 0.8, 0.6, 21, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1bf44486-6e6f-4465-8f6d-6c5f656e6769', id, 'mlops', 'MLOps & Deployment', 'MLOps', 60, 0.8, 0.7, 22, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4eba1f7a-6e6f-4465-8f6d-6c5f656e6769', id, 'ml_project', 'End-to-End ML Project', 'Projects', 70, 1, 0.5, 23, false, NOW()
FROM capability_graph WHERE slug = 'ml_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'python_for_data' AND n2.skill_id = 'python_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'software_engineering' AND n2.skill_id = 'python_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'linear_algebra' AND n2.skill_id = 'python_for_data'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'probability' AND n2.skill_id = 'statistics_basics'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'data_preparation' AND n2.skill_id = 'python_for_data'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'data_preparation' AND n2.skill_id = 'sql_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ml_foundations' AND n2.skill_id = 'data_preparation'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ml_foundations' AND n2.skill_id = 'linear_algebra'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'regression' AND n2.skill_id = 'ml_foundations'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'regression' AND n2.skill_id = 'probability'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'classification' AND n2.skill_id = 'ml_foundations'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'classification' AND n2.skill_id = 'probability'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'clustering' AND n2.skill_id = 'ml_foundations'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'model_evaluation' AND n2.skill_id = 'regression'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'model_evaluation' AND n2.skill_id = 'classification'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'model_evaluation' AND n2.skill_id = 'clustering'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'model_evaluation' AND n2.skill_id = 'statistics_basics'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'gradient_descent' AND n2.skill_id = 'regression'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'gradient_descent' AND n2.skill_id = 'calculus'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'model_optimization' AND n2.skill_id = 'model_evaluation'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'neural_networks' AND n2.skill_id = 'gradient_descent'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cnns' AND n2.skill_id = 'neural_networks'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'rnns' AND n2.skill_id = 'neural_networks'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'transformers' AND n2.skill_id = 'neural_networks'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'generative_ai' AND n2.skill_id = 'transformers'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'mlops' AND n2.skill_id = 'software_engineering'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'mlops' AND n2.skill_id = 'model_evaluation'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ml_project' AND n2.skill_id = 'model_evaluation'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ml_project' AND n2.skill_id = 'model_optimization'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ml_project' AND n2.skill_id = 'mlops'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'ml_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO capability_graph (id, slug, name, description, is_active, created_at, updated_at) VALUES
('4c5f9fc2-6772-4170-885f-646174615f61', 'data_analyst', 'Data Analyst', 'Data Analyst Path', true, NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '69036fe7-6e6f-4465-8f64-6174615f616e', id, 'sql', 'SQL', 'Data', 75, 0.95, 0.9, 1, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1b9bc0d9-6e6f-4465-8f64-6174615f616e', id, 'python_pandas', 'Python/Pandas', 'Programming', 70, 0.8, 0.8, 2, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '67943ae9-6e6f-4465-8f64-6174615f616e', id, 'data_preparation', 'Data Preparation', 'Data', 70, 0.9, 0.9, 3, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4328ef80-6e6f-4465-8f64-6174615f616e', id, 'probability', 'Probability', 'Statistics', 60, 0.7, 0.8, 4, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '64163b88-6e6f-4465-8f64-6174615f616e', id, 'statistics', 'Statistics', 'Statistics', 70, 0.9, 0.9, 5, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1cca7b3e-6e6f-4465-8f64-6174615f616e', id, 'hypothesis_testing', 'Hypothesis Testing', 'Statistics', 65, 0.8, 0.8, 6, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '2b5a4747-6e6f-4465-8f64-6174615f616e', id, 'ab_testing', 'A/B Testing', 'Statistics', 65, 0.8, 0.7, 7, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '09c345af-6e6f-4465-8f64-6174615f616e', id, 'visualization', 'Data Visualization', 'Visualization', 75, 0.9, 0.8, 8, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1113989f-6e6f-4465-8f64-6174615f616e', id, 'dashboard', 'Dashboard Design (BI Tools)', 'Visualization', 70, 0.8, 0.7, 9, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '6f25d485-6e6f-4465-8f64-6174615f616e', id, 'business_insights', 'Business Insights', 'Business', 70, 0.9, 0.8, 10, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '43a7052e-6e6f-4465-8f64-6174615f616e', id, 'business_experimentation', 'Business Experimentation', 'Business', 60, 0.7, 0.6, 11, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '48b396b9-6e6f-4465-8f64-6174615f616e', id, 'decision_making', 'Data-Driven Decision Making', 'Business', 80, 1, 0.5, 12, false, NOW()
FROM capability_graph WHERE slug = 'data_analyst'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'data_preparation' AND n2.skill_id = 'sql'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'data_preparation' AND n2.skill_id = 'python_pandas'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'statistics' AND n2.skill_id = 'probability'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'hypothesis_testing' AND n2.skill_id = 'statistics'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ab_testing' AND n2.skill_id = 'hypothesis_testing'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'visualization' AND n2.skill_id = 'data_preparation'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'dashboard' AND n2.skill_id = 'visualization'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'business_insights' AND n2.skill_id = 'dashboard'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'business_insights' AND n2.skill_id = 'statistics'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'business_experimentation' AND n2.skill_id = 'ab_testing'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'decision_making' AND n2.skill_id = 'business_insights'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'decision_making' AND n2.skill_id = 'business_experimentation'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'data_analyst')
ON CONFLICT DO NOTHING;

INSERT INTO capability_graph (id, slug, name, description, is_active, created_at, updated_at) VALUES
('51fd8d02-6772-4170-885f-66756c6c7374', 'fullstack_dev', 'Full-Stack Developer', 'Full-Stack Developer Path', true, NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '17abebf4-6e6f-4465-8f66-756c6c737461', id, 'html_css_js', 'HTML/CSS/JS', 'Frontend', 75, 0.9, 0.9, 1, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '34e87c4e-6e6f-4465-8f66-756c6c737461', id, 'react', 'React', 'Frontend', 75, 0.9, 0.8, 2, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7d98340b-6e6f-4465-8f66-756c6c737461', id, 'http', 'HTTP Fundamentals', 'Network', 70, 0.8, 0.85, 3, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7ba2c3d7-6e6f-4465-8f66-756c6c737461', id, 'rest_apis', 'REST APIs', 'Backend', 75, 0.9, 0.8, 4, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '5c39a998-6e6f-4465-8f66-756c6c737461', id, 'database', 'Database Design (SQL/NoSQL)', 'Database', 75, 0.9, 0.85, 5, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '66453de2-6e6f-4465-8f66-756c6c737461', id, 'backend_api', 'Backend API Development', 'Backend', 75, 0.95, 0.9, 6, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7799425e-6e6f-4465-8f66-756c6c737461', id, 'api_integration', 'API Integration', 'Frontend', 75, 0.9, 0.8, 7, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '69e701a5-6e6f-4465-8f66-756c6c737461', id, 'authentication', 'Authentication & JWT', 'Security', 70, 0.85, 0.7, 8, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '414de4c7-6e6f-4465-8f66-756c6c737461', id, 'websockets', 'WebSockets (Real-Time)', 'Network', 60, 0.6, 0.4, 9, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '4312dd32-6e6f-4465-8f66-756c6c737461', id, 'caching', 'Caching (Redis)', 'Database', 60, 0.6, 0.5, 10, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '71afbc2d-6e6f-4465-8f66-756c6c737461', id, 'security', 'Backend Security (CORS, XSS, Injection)', 'Security', 70, 0.8, 0.6, 11, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '3da71255-6e6f-4465-8f66-756c6c737461', id, 'microservices', 'Microservices', 'Architecture', 60, 0.6, 0.5, 12, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '31e8e47d-6e6f-4465-8f66-756c6c737461', id, 'testing', 'Testing (Unit, E2E)', 'DevOps', 65, 0.7, 0.7, 13, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7f7cf5b3-6e6f-4465-8f66-756c6c737461', id, 'docker', 'Docker', 'DevOps', 65, 0.75, 0.8, 14, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7d9aa54c-6e6f-4465-8f66-756c6c737461', id, 'cicd', 'CI/CD Pipelines', 'DevOps', 65, 0.75, 0.8, 15, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '07d7b6fc-6e6f-4465-8f66-756c6c737461', id, 'cloud_deployment', 'Cloud Deployment', 'DevOps', 70, 0.8, 0.8, 16, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '0975eeff-6e6f-4465-8f66-756c6c737461', id, 'system_design', 'System Design', 'Architecture', 65, 0.7, 0.6, 17, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '39d4a01a-6e6f-4465-8f66-756c6c737461', id, 'fullstack_project', 'End-to-End Full-Stack Project', 'Projects', 75, 1, 0.5, 18, false, NOW()
FROM capability_graph WHERE slug = 'fullstack_dev'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'react' AND n2.skill_id = 'html_css_js'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'rest_apis' AND n2.skill_id = 'http'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'backend_api' AND n2.skill_id = 'rest_apis'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'backend_api' AND n2.skill_id = 'database'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'api_integration' AND n2.skill_id = 'react'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'api_integration' AND n2.skill_id = 'rest_apis'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'authentication' AND n2.skill_id = 'http'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'authentication' AND n2.skill_id = 'database'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'websockets' AND n2.skill_id = 'http'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'caching' AND n2.skill_id = 'database'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'security' AND n2.skill_id = 'backend_api'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'security' AND n2.skill_id = 'authentication'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'microservices' AND n2.skill_id = 'backend_api'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'testing' AND n2.skill_id = 'backend_api'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'testing' AND n2.skill_id = 'authentication'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'docker' AND n2.skill_id = 'testing'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cicd' AND n2.skill_id = 'docker'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_deployment' AND n2.skill_id = 'cicd'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'system_design' AND n2.skill_id = 'database'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'system_design' AND n2.skill_id = 'caching'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'system_design' AND n2.skill_id = 'security'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'system_design' AND n2.skill_id = 'microservices'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'fullstack_project' AND n2.skill_id = 'api_integration'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'fullstack_project' AND n2.skill_id = 'cloud_deployment'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'fullstack_project' AND n2.skill_id = 'system_design'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'fullstack_project' AND n2.skill_id = 'websockets'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'fullstack_dev')
ON CONFLICT DO NOTHING;

INSERT INTO capability_graph (id, slug, name, description, is_active, created_at, updated_at) VALUES
('3d8cdbb6-6772-4170-885f-636c6f75645f', 'cloud_engineer', 'Cloud Engineer', 'Cloud Engineer Path', true, NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1e54c48b-6e6f-4465-8f63-6c6f75645f65', id, 'linux', 'Linux OS', 'Compute', 75, 0.9, 0.85, 1, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '7f16e643-6e6f-4465-8f63-6c6f75645f65', id, 'networking', 'Networking (TCP/IP, DNS, VPN)', 'Network', 75, 0.9, 0.85, 2, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '2fa6fc54-6e6f-4465-8f63-6c6f75645f65', id, 'iam', 'IAM (Identity & Access Mgmt)', 'Security', 80, 0.9, 0.85, 3, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '67c10e9f-6e6f-4465-8f63-6c6f75645f65', id, 'cloud_fundamentals', 'Cloud Fundamentals (IaaS, PaaS)', 'Cloud', 75, 0.95, 0.9, 4, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '75fe9eeb-6e6f-4465-8f63-6c6f75645f65', id, 'terraform', 'Terraform (IaC)', 'DevOps', 70, 0.85, 0.8, 5, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '61139297-6e6f-4465-8f63-6c6f75645f65', id, 'docker', 'Docker & Containers', 'Compute', 75, 0.85, 0.85, 6, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '18ce01f1-6e6f-4465-8f63-6c6f75645f65', id, 'kubernetes', 'Kubernetes', 'Compute', 70, 0.8, 0.8, 7, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '45a71c8c-6e6f-4465-8f63-6c6f75645f65', id, 'ingress', 'Kubernetes Ingress', 'Network', 65, 0.7, 0.6, 8, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '0a4a720e-6e6f-4465-8f63-6c6f75645f65', id, 'compute', 'Cloud Compute (VMs, Serverless)', 'Cloud', 75, 0.85, 0.7, 9, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '61532c52-6e6f-4465-8f63-6c6f75645f65', id, 'storage', 'Cloud Storage', 'Cloud', 70, 0.8, 0.7, 10, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '2497c972-6e6f-4465-8f63-6c6f75645f65', id, 'cloud_database', 'Cloud Databases', 'Cloud', 70, 0.8, 0.7, 11, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '64b337b7-6e6f-4465-8f63-6c6f75645f65', id, 'security', 'Cloud Security', 'Security', 75, 0.85, 0.7, 12, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '35bccce6-6e6f-4465-8f63-6c6f75645f65', id, 'cloud_architecture', 'Cloud Architecture & Scalability', 'Architecture', 70, 0.95, 0.9, 13, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '43eb2f79-6e6f-4465-8f63-6c6f75645f65', id, 'infrastructure_as_code', 'Infrastructure as Code', 'DevOps', 70, 0.8, 0.8, 14, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '3ac4d4d0-6e6f-4465-8f63-6c6f75645f65', id, 'cicd', 'CI/CD for Cloud', 'DevOps', 70, 0.8, 0.8, 15, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '1104ed8e-6e6f-4465-8f63-6c6f75645f65', id, 'deployment', 'Automated Deployment', 'DevOps', 70, 0.8, 0.7, 16, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '0bced711-6e6f-4465-8f63-6c6f75645f65', id, 'monitoring', 'Monitoring & Observability', 'DevOps', 70, 0.8, 0.7, 17, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '18fe1625-6e6f-4465-8f63-6c6f75645f65', id, 'incident_response', 'Incident Response', 'DevOps', 65, 0.75, 0.6, 18, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node (id, graph_id, skill_id, label, category, mastery_threshold, goal_relevance, dependency_impact, sequence_order, is_custom, created_at)
SELECT '6161485a-6e6f-4465-8f63-6c6f75645f65', id, 'cloud_project', 'End-to-End Cloud Infrastructure', 'Projects', 75, 1, 0.5, 19, false, NOW()
FROM capability_graph WHERE slug = 'cloud_engineer'
ON CONFLICT (graph_id, skill_id) DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'docker' AND n2.skill_id = 'linux'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'kubernetes' AND n2.skill_id = 'docker'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ingress' AND n2.skill_id = 'networking'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'ingress' AND n2.skill_id = 'kubernetes'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'compute' AND n2.skill_id = 'cloud_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'storage' AND n2.skill_id = 'cloud_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_database' AND n2.skill_id = 'cloud_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'security' AND n2.skill_id = 'iam'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_architecture' AND n2.skill_id = 'ingress'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_architecture' AND n2.skill_id = 'compute'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_architecture' AND n2.skill_id = 'storage'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_architecture' AND n2.skill_id = 'cloud_database'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_architecture' AND n2.skill_id = 'security'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_architecture' AND n2.skill_id = 'cloud_fundamentals'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'infrastructure_as_code' AND n2.skill_id = 'terraform'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cicd' AND n2.skill_id = 'infrastructure_as_code'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'deployment' AND n2.skill_id = 'cicd'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'monitoring' AND n2.skill_id = 'deployment'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'incident_response' AND n2.skill_id = 'monitoring'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_project' AND n2.skill_id = 'cloud_architecture'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

INSERT INTO graph_node_prerequisite (node_id, prerequisite_id)
SELECT n1.id, n2.id
FROM graph_node n1, graph_node n2
WHERE n1.skill_id = 'cloud_project' AND n2.skill_id = 'incident_response'
AND n1.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
AND n2.graph_id = (SELECT id FROM capability_graph WHERE slug = 'cloud_engineer')
ON CONFLICT DO NOTHING;

