export const capabilityGraphs = {
  ml_engineer: {
    id: 'ml_engineer',
    name: 'ML Engineer',
    nodes: {
      'python_fundamentals': {
        id: 'python_fundamentals',
        label: 'Python Fundamentals',
        category: 'Programming',
        prerequisites: [],
        unlocks: ['python_for_data', 'software_engineering'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'python_for_data': {
        id: 'python_for_data',
        label: 'Python for Data (NumPy, Pandas)',
        category: 'Programming',
        prerequisites: ['python_fundamentals'],
        unlocks: ['data_preparation', 'linear_algebra'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'software_engineering': {
        id: 'software_engineering',
        label: 'Software Engineering (Git, Testing)',
        category: 'Programming',
        prerequisites: ['python_fundamentals'],
        unlocks: ['mlops'],
        masteryThreshold: 60,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'linear_algebra': {
        id: 'linear_algebra',
        label: 'Linear Algebra',
        category: 'Mathematics',
        prerequisites: ['python_for_data'],
        unlocks: ['ml_foundations'],
        masteryThreshold: 65,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'calculus': {
        id: 'calculus',
        label: 'Calculus (Derivatives, Gradients)',
        category: 'Mathematics',
        prerequisites: [],
        unlocks: ['gradient_descent'],
        masteryThreshold: 60,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'statistics_basics': {
        id: 'statistics_basics',
        label: 'Descriptive Statistics',
        category: 'Mathematics',
        prerequisites: [],
        unlocks: ['probability'],
        masteryThreshold: 65,
        goalRelevance: 0.8,
        dependencyImpact: 0.9
      },
      'probability': {
        id: 'probability',
        label: 'Probability',
        category: 'Mathematics',
        prerequisites: ['statistics_basics'],
        unlocks: ['regression', 'classification'],
        masteryThreshold: 65,
        goalRelevance: 0.9,
        dependencyImpact: 0.95
      },
      'sql_fundamentals': {
        id: 'sql_fundamentals',
        label: 'SQL Fundamentals',
        category: 'Data',
        prerequisites: [],
        unlocks: ['data_preparation'],
        masteryThreshold: 60,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'data_preparation': {
        id: 'data_preparation',
        label: 'Data Preparation & Feature Eng',
        category: 'Data',
        prerequisites: ['python_for_data', 'sql_fundamentals'],
        unlocks: ['ml_foundations'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'ml_foundations': {
        id: 'ml_foundations',
        label: 'ML Foundations Overview',
        category: 'Machine Learning',
        prerequisites: ['data_preparation', 'linear_algebra'],
        unlocks: ['regression', 'classification', 'clustering'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'regression': {
        id: 'regression',
        label: 'Regression',
        category: 'Machine Learning',
        prerequisites: ['ml_foundations', 'probability'],
        unlocks: ['model_evaluation', 'gradient_descent'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.85
      },
      'classification': {
        id: 'classification',
        label: 'Classification',
        category: 'Machine Learning',
        prerequisites: ['ml_foundations', 'probability'],
        unlocks: ['model_evaluation'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.85
      },
      'clustering': {
        id: 'clustering',
        label: 'Unsupervised Learning (Clustering)',
        category: 'Machine Learning',
        prerequisites: ['ml_foundations'],
        unlocks: ['model_evaluation'],
        masteryThreshold: 60,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'model_evaluation': {
        id: 'model_evaluation',
        label: 'Model Evaluation',
        category: 'Machine Learning',
        prerequisites: ['regression', 'classification', 'clustering', 'statistics_basics'],
        unlocks: ['model_optimization', 'ml_project'],
        masteryThreshold: 65,
        goalRelevance: 0.95,
        dependencyImpact: 0.9
      },
      'gradient_descent': {
        id: 'gradient_descent',
        label: 'Gradient Descent',
        category: 'Machine Learning',
        prerequisites: ['regression', 'calculus'],
        unlocks: ['neural_networks'],
        masteryThreshold: 65,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'model_optimization': {
        id: 'model_optimization',
        label: 'Model Optimization',
        category: 'Machine Learning',
        prerequisites: ['model_evaluation'],
        unlocks: ['ml_project'],
        masteryThreshold: 65,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'neural_networks': {
        id: 'neural_networks',
        label: 'Neural Network Fundamentals',
        category: 'Deep Learning',
        prerequisites: ['gradient_descent'],
        unlocks: ['cnns', 'rnns', 'transformers'],
        masteryThreshold: 60,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'cnns': {
        id: 'cnns',
        label: 'CNNs (Computer Vision)',
        category: 'Deep Learning',
        prerequisites: ['neural_networks'],
        unlocks: [],
        masteryThreshold: 55,
        goalRelevance: 0.6,
        dependencyImpact: 0.3
      },
      'rnns': {
        id: 'rnns',
        label: 'RNNs / LSTMs',
        category: 'Deep Learning',
        prerequisites: ['neural_networks'],
        unlocks: [],
        masteryThreshold: 55,
        goalRelevance: 0.6,
        dependencyImpact: 0.3
      },
      'transformers': {
        id: 'transformers',
        label: 'Transformers',
        category: 'Deep Learning',
        prerequisites: ['neural_networks'],
        unlocks: ['generative_ai'],
        masteryThreshold: 60,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'generative_ai': {
        id: 'generative_ai',
        label: 'Generative AI & LLMs (RAG)',
        category: 'Generative AI',
        prerequisites: ['transformers'],
        unlocks: [],
        masteryThreshold: 60,
        goalRelevance: 0.8,
        dependencyImpact: 0.6
      },
      'mlops': {
        id: 'mlops',
        label: 'MLOps & Deployment',
        category: 'MLOps',
        prerequisites: ['software_engineering', 'model_evaluation'],
        unlocks: ['ml_project'],
        masteryThreshold: 60,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'ml_project': {
        id: 'ml_project',
        label: 'End-to-End ML Project',
        category: 'Projects',
        prerequisites: ['model_evaluation', 'model_optimization', 'mlops'],
        unlocks: [],
        masteryThreshold: 70,
        goalRelevance: 1.0,
        dependencyImpact: 0.0
      }
    }
  },
  data_analyst: {
    id: 'data_analyst',
    name: 'Data Analyst',
    nodes: {
      'sql': {
        id: 'sql',
        label: 'SQL',
        category: 'Data',
        prerequisites: [],
        unlocks: ['data_preparation'],
        masteryThreshold: 75,
        goalRelevance: 0.95,
        dependencyImpact: 0.9
      },
      'python_pandas': {
        id: 'python_pandas',
        label: 'Python/Pandas',
        category: 'Programming',
        prerequisites: [],
        unlocks: ['data_preparation'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'data_preparation': {
        id: 'data_preparation',
        label: 'Data Preparation',
        category: 'Data',
        prerequisites: ['sql', 'python_pandas'],
        unlocks: ['visualization'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'probability': {
        id: 'probability',
        label: 'Probability',
        category: 'Statistics',
        prerequisites: [],
        unlocks: ['statistics'],
        masteryThreshold: 60,
        goalRelevance: 0.7,
        dependencyImpact: 0.8
      },
      'statistics': {
        id: 'statistics',
        label: 'Statistics',
        category: 'Statistics',
        prerequisites: ['probability'],
        unlocks: ['hypothesis_testing', 'business_insights'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'hypothesis_testing': {
        id: 'hypothesis_testing',
        label: 'Hypothesis Testing',
        category: 'Statistics',
        prerequisites: ['statistics'],
        unlocks: ['ab_testing'],
        masteryThreshold: 65,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'ab_testing': {
        id: 'ab_testing',
        label: 'A/B Testing',
        category: 'Statistics',
        prerequisites: ['hypothesis_testing'],
        unlocks: ['business_experimentation'],
        masteryThreshold: 65,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'visualization': {
        id: 'visualization',
        label: 'Data Visualization',
        category: 'Visualization',
        prerequisites: ['data_preparation'],
        unlocks: ['dashboard'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.8
      },
      'dashboard': {
        id: 'dashboard',
        label: 'Dashboard Design (BI Tools)',
        category: 'Visualization',
        prerequisites: ['visualization'],
        unlocks: ['business_insights'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'business_insights': {
        id: 'business_insights',
        label: 'Business Insights',
        category: 'Business',
        prerequisites: ['dashboard', 'statistics'],
        unlocks: ['decision_making'],
        masteryThreshold: 70,
        goalRelevance: 0.9,
        dependencyImpact: 0.8
      },
      'business_experimentation': {
        id: 'business_experimentation',
        label: 'Business Experimentation',
        category: 'Business',
        prerequisites: ['ab_testing'],
        unlocks: ['decision_making'],
        masteryThreshold: 60,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'decision_making': {
        id: 'decision_making',
        label: 'Data-Driven Decision Making',
        category: 'Business',
        prerequisites: ['business_insights', 'business_experimentation'],
        unlocks: [],
        masteryThreshold: 80,
        goalRelevance: 1.0,
        dependencyImpact: 0.0
      }
    }
  },
  fullstack_dev: {
    id: 'fullstack_dev',
    name: 'Full-Stack Developer',
    nodes: {
      'html_css_js': {
        id: 'html_css_js',
        label: 'HTML/CSS/JS',
        category: 'Frontend',
        prerequisites: [],
        unlocks: ['react'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.9
      },
      'react': {
        id: 'react',
        label: 'React',
        category: 'Frontend',
        prerequisites: ['html_css_js'],
        unlocks: ['api_integration'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.8
      },
      'http': {
        id: 'http',
        label: 'HTTP Fundamentals',
        category: 'Network',
        prerequisites: [],
        unlocks: ['rest_apis', 'authentication', 'websockets'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.85
      },
      'rest_apis': {
        id: 'rest_apis',
        label: 'REST APIs',
        category: 'Backend',
        prerequisites: ['http'],
        unlocks: ['backend_api', 'api_integration'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.8
      },
      'database': {
        id: 'database',
        label: 'Database Design (SQL/NoSQL)',
        category: 'Database',
        prerequisites: [],
        unlocks: ['backend_api', 'caching', 'system_design'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.85
      },
      'backend_api': {
        id: 'backend_api',
        label: 'Backend API Development',
        category: 'Backend',
        prerequisites: ['rest_apis', 'database'],
        unlocks: ['testing', 'security', 'microservices'],
        masteryThreshold: 75,
        goalRelevance: 0.95,
        dependencyImpact: 0.9
      },
      'api_integration': {
        id: 'api_integration',
        label: 'API Integration',
        category: 'Frontend',
        prerequisites: ['react', 'rest_apis'],
        unlocks: ['fullstack_project'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.8
      },
      'authentication': {
        id: 'authentication',
        label: 'Authentication & JWT',
        category: 'Security',
        prerequisites: ['http', 'database'],
        unlocks: ['security', 'testing'],
        masteryThreshold: 70,
        goalRelevance: 0.85,
        dependencyImpact: 0.7
      },
      'websockets': {
        id: 'websockets',
        label: 'WebSockets (Real-Time)',
        category: 'Network',
        prerequisites: ['http'],
        unlocks: ['fullstack_project'],
        masteryThreshold: 60,
        goalRelevance: 0.6,
        dependencyImpact: 0.4
      },
      'caching': {
        id: 'caching',
        label: 'Caching (Redis)',
        category: 'Database',
        prerequisites: ['database'],
        unlocks: ['system_design'],
        masteryThreshold: 60,
        goalRelevance: 0.6,
        dependencyImpact: 0.5
      },
      'security': {
        id: 'security',
        label: 'Backend Security (CORS, XSS, Injection)',
        category: 'Security',
        prerequisites: ['backend_api', 'authentication'],
        unlocks: ['system_design'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.6
      },
      'microservices': {
        id: 'microservices',
        label: 'Microservices',
        category: 'Architecture',
        prerequisites: ['backend_api'],
        unlocks: ['system_design'],
        masteryThreshold: 60,
        goalRelevance: 0.6,
        dependencyImpact: 0.5
      },
      'testing': {
        id: 'testing',
        label: 'Testing (Unit, E2E)',
        category: 'DevOps',
        prerequisites: ['backend_api', 'authentication'],
        unlocks: ['docker'],
        masteryThreshold: 65,
        goalRelevance: 0.7,
        dependencyImpact: 0.7
      },
      'docker': {
        id: 'docker',
        label: 'Docker',
        category: 'DevOps',
        prerequisites: ['testing'],
        unlocks: ['cicd'],
        masteryThreshold: 65,
        goalRelevance: 0.75,
        dependencyImpact: 0.8
      },
      'cicd': {
        id: 'cicd',
        label: 'CI/CD Pipelines',
        category: 'DevOps',
        prerequisites: ['docker'],
        unlocks: ['cloud_deployment'],
        masteryThreshold: 65,
        goalRelevance: 0.75,
        dependencyImpact: 0.8
      },
      'cloud_deployment': {
        id: 'cloud_deployment',
        label: 'Cloud Deployment',
        category: 'DevOps',
        prerequisites: ['cicd'],
        unlocks: ['fullstack_project'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'system_design': {
        id: 'system_design',
        label: 'System Design',
        category: 'Architecture',
        prerequisites: ['database', 'caching', 'security', 'microservices'],
        unlocks: ['fullstack_project'],
        masteryThreshold: 65,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'fullstack_project': {
        id: 'fullstack_project',
        label: 'End-to-End Full-Stack Project',
        category: 'Projects',
        prerequisites: ['api_integration', 'cloud_deployment', 'system_design', 'websockets'],
        unlocks: [],
        masteryThreshold: 75,
        goalRelevance: 1.0,
        dependencyImpact: 0.0
      }
    }
  },
  cloud_engineer: {
    id: 'cloud_engineer',
    name: 'Cloud Engineer',
    nodes: {
      'linux': {
        id: 'linux',
        label: 'Linux OS',
        category: 'Compute',
        prerequisites: [],
        unlocks: ['docker'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.85
      },
      'networking': {
        id: 'networking',
        label: 'Networking (TCP/IP, DNS, VPN)',
        category: 'Network',
        prerequisites: [],
        unlocks: ['ingress'],
        masteryThreshold: 75,
        goalRelevance: 0.9,
        dependencyImpact: 0.85
      },
      'iam': {
        id: 'iam',
        label: 'IAM (Identity & Access Mgmt)',
        category: 'Security',
        prerequisites: [],
        unlocks: ['security'],
        masteryThreshold: 80,
        goalRelevance: 0.9,
        dependencyImpact: 0.85
      },
      'cloud_fundamentals': {
        id: 'cloud_fundamentals',
        label: 'Cloud Fundamentals (IaaS, PaaS)',
        category: 'Cloud',
        prerequisites: [],
        unlocks: ['compute', 'storage', 'cloud_database', 'cloud_architecture'],
        masteryThreshold: 75,
        goalRelevance: 0.95,
        dependencyImpact: 0.9
      },
      'terraform': {
        id: 'terraform',
        label: 'Terraform (IaC)',
        category: 'DevOps',
        prerequisites: [],
        unlocks: ['infrastructure_as_code'],
        masteryThreshold: 70,
        goalRelevance: 0.85,
        dependencyImpact: 0.8
      },
      'docker': {
        id: 'docker',
        label: 'Docker & Containers',
        category: 'Compute',
        prerequisites: ['linux'],
        unlocks: ['kubernetes'],
        masteryThreshold: 75,
        goalRelevance: 0.85,
        dependencyImpact: 0.85
      },
      'kubernetes': {
        id: 'kubernetes',
        label: 'Kubernetes',
        category: 'Compute',
        prerequisites: ['docker'],
        unlocks: ['ingress'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'ingress': {
        id: 'ingress',
        label: 'Kubernetes Ingress',
        category: 'Network',
        prerequisites: ['networking', 'kubernetes'],
        unlocks: ['cloud_architecture'],
        masteryThreshold: 65,
        goalRelevance: 0.7,
        dependencyImpact: 0.6
      },
      'compute': {
        id: 'compute',
        label: 'Cloud Compute (VMs, Serverless)',
        category: 'Cloud',
        prerequisites: ['cloud_fundamentals'],
        unlocks: ['cloud_architecture'],
        masteryThreshold: 75,
        goalRelevance: 0.85,
        dependencyImpact: 0.7
      },
      'storage': {
        id: 'storage',
        label: 'Cloud Storage',
        category: 'Cloud',
        prerequisites: ['cloud_fundamentals'],
        unlocks: ['cloud_architecture'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'cloud_database': {
        id: 'cloud_database',
        label: 'Cloud Databases',
        category: 'Cloud',
        prerequisites: ['cloud_fundamentals'],
        unlocks: ['cloud_architecture'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'security': {
        id: 'security',
        label: 'Cloud Security',
        category: 'Security',
        prerequisites: ['iam'],
        unlocks: ['cloud_architecture'],
        masteryThreshold: 75,
        goalRelevance: 0.85,
        dependencyImpact: 0.7
      },
      'cloud_architecture': {
        id: 'cloud_architecture',
        label: 'Cloud Architecture & Scalability',
        category: 'Architecture',
        prerequisites: ['ingress', 'compute', 'storage', 'cloud_database', 'security', 'cloud_fundamentals'],
        unlocks: ['cloud_project'],
        masteryThreshold: 70,
        goalRelevance: 0.95,
        dependencyImpact: 0.9
      },
      'infrastructure_as_code': {
        id: 'infrastructure_as_code',
        label: 'Infrastructure as Code',
        category: 'DevOps',
        prerequisites: ['terraform'],
        unlocks: ['cicd'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'cicd': {
        id: 'cicd',
        label: 'CI/CD for Cloud',
        category: 'DevOps',
        prerequisites: ['infrastructure_as_code'],
        unlocks: ['deployment'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.8
      },
      'deployment': {
        id: 'deployment',
        label: 'Automated Deployment',
        category: 'DevOps',
        prerequisites: ['cicd'],
        unlocks: ['monitoring'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'monitoring': {
        id: 'monitoring',
        label: 'Monitoring & Observability',
        category: 'DevOps',
        prerequisites: ['deployment'],
        unlocks: ['incident_response'],
        masteryThreshold: 70,
        goalRelevance: 0.8,
        dependencyImpact: 0.7
      },
      'incident_response': {
        id: 'incident_response',
        label: 'Incident Response',
        category: 'DevOps',
        prerequisites: ['monitoring'],
        unlocks: ['cloud_project'],
        masteryThreshold: 65,
        goalRelevance: 0.75,
        dependencyImpact: 0.6
      },
      'cloud_project': {
        id: 'cloud_project',
        label: 'End-to-End Cloud Infrastructure',
        category: 'Projects',
        prerequisites: ['cloud_architecture', 'incident_response'],
        unlocks: [],
        masteryThreshold: 75,
        goalRelevance: 1.0,
        dependencyImpact: 0.0
      }
    }
  }
};
