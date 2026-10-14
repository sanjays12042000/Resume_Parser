/* The skill dictionary the scorer matches against.
   weight: 3 = core to the role, 1 = nice to have.
   aliases: other spellings that should also count as a hit. */
export const ROLES = {
  frontend: {
    label: "Frontend Engineer",
    skills: [
      { name: "JavaScript", weight: 3, aliases: ["js", "es6", "ecmascript"] },
      { name: "TypeScript", weight: 2, aliases: ["ts"] },
      { name: "React", weight: 3, aliases: ["react.js", "reactjs"] },
      { name: "HTML", weight: 2, aliases: ["html5"] },
      { name: "CSS", weight: 2, aliases: ["css3", "scss", "sass"] },
      { name: "Accessibility", weight: 1, aliases: ["a11y", "wcag", "aria"] },
      { name: "Testing", weight: 2, aliases: ["jest", "vitest", "playwright", "cypress", "unit test"] },
      { name: "Git", weight: 2, aliases: ["github", "gitlab", "version control"] },
      { name: "REST APIs", weight: 2, aliases: ["rest api", "restful", "fetch api"] },
      { name: "Performance", weight: 2, aliases: ["lighthouse", "core web vitals", "web performance"] },
      { name: "Build tools", weight: 1, aliases: ["webpack", "vite", "esbuild", "rollup"] },
      { name: "Responsive design", weight: 2, aliases: ["mobile-first", "media queries"] },
      { name: "State management", weight: 1, aliases: ["redux", "zustand", "context api"] },
      { name: "Node.js", weight: 1, aliases: ["node", "express"] }
    ]
  },
  backend: {
    label: "Backend Engineer",
    skills: [
      { name: "Node.js", weight: 2, aliases: ["node", "express", "nestjs"] },
      { name: "Python", weight: 2, aliases: ["django", "flask", "fastapi"] },
      { name: "SQL", weight: 3, aliases: ["postgres", "postgresql", "mysql", "sqlite"] },
      { name: "NoSQL", weight: 1, aliases: ["mongodb", "dynamodb", "redis"] },
      { name: "REST APIs", weight: 3, aliases: ["rest api", "restful"] },
      { name: "Authentication", weight: 2, aliases: ["jwt", "oauth", "auth", "session"] },
      { name: "Docker", weight: 2, aliases: ["container", "dockerfile"] },
      { name: "CI/CD", weight: 2, aliases: ["github actions", "jenkins", "pipeline"] },
      { name: "Cloud", weight: 2, aliases: ["aws", "gcp", "azure", "s3", "ec2"] },
      { name: "Testing", weight: 2, aliases: ["pytest", "jest", "integration test", "unit test"] },
      { name: "Caching", weight: 1, aliases: ["redis", "memcached", "cdn"] },
      { name: "Message queues", weight: 1, aliases: ["kafka", "rabbitmq", "sqs", "pub/sub"] },
      { name: "Git", weight: 1, aliases: ["github", "version control"] },
      { name: "System design", weight: 2, aliases: ["scalability", "architecture", "load balancing"] }
    ]
  },
  fullstack: {
    label: "Full-stack Developer",
    skills: [
      { name: "JavaScript", weight: 3, aliases: ["js", "es6"] },
      { name: "TypeScript", weight: 2, aliases: ["ts"] },
      { name: "React", weight: 2, aliases: ["react.js", "next.js", "nextjs"] },
      { name: "Node.js", weight: 2, aliases: ["node", "express"] },
      { name: "HTML", weight: 1, aliases: ["html5"] },
      { name: "CSS", weight: 2, aliases: ["css3", "tailwind", "scss"] },
      { name: "SQL", weight: 2, aliases: ["postgres", "postgresql", "mysql"] },
      { name: "REST APIs", weight: 3, aliases: ["rest api", "restful", "graphql"] },
      { name: "Authentication", weight: 1, aliases: ["jwt", "oauth", "auth"] },
      { name: "Git", weight: 2, aliases: ["github", "version control"] },
      { name: "Testing", weight: 2, aliases: ["jest", "vitest", "cypress", "pytest"] },
      { name: "Docker", weight: 1, aliases: ["container", "dockerfile"] },
      { name: "Deployment", weight: 2, aliases: ["vercel", "netlify", "heroku", "cloud", "aws", "ci/cd"] },
      { name: "State management", weight: 1, aliases: ["redux", "zustand", "context api"] }
    ]
  },
  data: {
    label: "Data / ML Engineer",
    skills: [
      { name: "Python", weight: 3, aliases: ["pandas", "numpy"] },
      { name: "SQL", weight: 3, aliases: ["postgres", "postgresql", "mysql", "bigquery"] },
      { name: "Machine learning", weight: 3, aliases: ["ml", "scikit-learn", "sklearn", "model training"] },
      { name: "Deep learning", weight: 1, aliases: ["pytorch", "tensorflow", "keras", "neural network"] },
      {
        name: "Data visualisation",
        weight: 1,
        aliases: ["matplotlib", "seaborn", "tableau", "power bi", "data visualization"]
      },
      { name: "Statistics", weight: 2, aliases: ["statistical", "regression", "hypothesis testing"] },
      { name: "ETL / pipelines", weight: 2, aliases: ["etl", "airflow", "data pipeline", "dbt"] },
      { name: "Spark", weight: 1, aliases: ["pyspark", "hadoop", "databricks"] },
      { name: "Cloud", weight: 2, aliases: ["aws", "gcp", "azure", "sagemaker"] },
      { name: "Docker", weight: 1, aliases: ["container", "dockerfile"] },
      { name: "Git", weight: 1, aliases: ["github", "version control"] },
      { name: "Data modelling", weight: 2, aliases: ["data modeling", "schema design", "feature engineering"] },
      { name: "Experimentation", weight: 1, aliases: ["a/b test", "ab testing", "experiment"] },
      { name: "Notebooks", weight: 1, aliases: ["jupyter", "colab", "databricks notebook"] }
    ]
  }
};

export const ROLE_OPTIONS = Object.entries(ROLES).map(([key, role]) => ({
  key,
  label: role.label
}));
