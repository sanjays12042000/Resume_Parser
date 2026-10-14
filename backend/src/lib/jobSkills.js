import { aliasRegex } from "./skills.js";

/* The catalogue of skills we can recognise in a job description.
   Each entry is what a recruiter might write; aliases cover the spellings
   that show up in real postings. Order does not matter. */
export const SKILL_CATALOG = [
  { name: "JavaScript", aliases: ["js", "es6", "ecmascript", "vanilla js"] },
  { name: "TypeScript", aliases: ["ts"] },
  { name: "React", aliases: ["react.js", "reactjs", "next.js", "nextjs"] },
  { name: "Vue", aliases: ["vue.js", "vuejs", "nuxt"] },
  { name: "Angular", aliases: ["angularjs"] },
  { name: "HTML", aliases: ["html5", "semantic markup"] },
  { name: "CSS", aliases: ["css3", "scss", "sass", "less", "tailwind"] },
  { name: "Responsive design", aliases: ["mobile-first", "media queries", "responsive"] },
  { name: "Accessibility", aliases: ["a11y", "wcag", "aria"] },
  { name: "Node.js", aliases: ["node", "nodejs", "express", "nestjs"] },
  { name: "Python", aliases: ["django", "flask", "fastapi"] },
  { name: "Java", aliases: ["spring boot", "spring"] },
  { name: "Go", aliases: ["golang"] },
  { name: "C#", aliases: [".net", "dotnet", "asp.net"] },
  { name: "PHP", aliases: ["laravel", "symfony"] },
  { name: "Ruby", aliases: ["rails", "ruby on rails"] },
  { name: "REST APIs", aliases: ["rest api", "restful", "rest endpoints", "api design"] },
  { name: "GraphQL", aliases: ["apollo"] },
  { name: "SQL", aliases: ["postgres", "postgresql", "mysql", "sqlite", "bigquery", "mssql", "oracle"] },
  { name: "NoSQL", aliases: ["mongodb", "mongo", "dynamodb", "cassandra", "firestore"] },
  { name: "ORM", aliases: ["mongoose", "sequelize", "prisma", "hibernate"] },
  { name: "Authentication", aliases: ["jwt", "oauth", "oauth2", "sso", "auth", "session management"] },
  { name: "Testing", aliases: ["jest", "vitest", "mocha", "pytest", "junit", "cypress", "playwright", "selenium", "unit test", "integration test", "tdd"] },
  { name: "Git", aliases: ["github", "gitlab", "bitbucket", "version control"] },
  { name: "CI/CD", aliases: ["github actions", "jenkins", "gitlab ci", "circleci", "pipeline", "continuous integration"] },
  { name: "Docker", aliases: ["container", "containerisation", "containerization", "dockerfile"] },
  { name: "Kubernetes", aliases: ["k8s", "helm", "eks", "gke"] },
  { name: "Cloud", aliases: ["aws", "gcp", "azure", "s3", "ec2", "lambda", "cloud run"] },
  { name: "Serverless", aliases: ["lambda functions", "cloud functions", "edge functions"] },
  { name: "Caching", aliases: ["redis", "memcached", "cdn", "varnish"] },
  { name: "Message queues", aliases: ["kafka", "rabbitmq", "sqs", "pub/sub", "event-driven"] },
  { name: "System design", aliases: ["scalability", "scalable", "microservices", "architecture", "load balancing", "high availability"] },
  { name: "Performance", aliases: ["lighthouse", "core web vitals", "web performance", "optimisation", "optimization", "profiling"] },
  { name: "Build tools", aliases: ["webpack", "vite", "esbuild", "rollup", "babel"] },
  { name: "State management", aliases: ["redux", "zustand", "context api", "mobx", "pinia", "vuex"] },
  { name: "Data visualisation", aliases: ["data visualization", "d3", "chart.js", "recharts", "tableau", "power bi", "matplotlib", "seaborn"] },
  { name: "Machine learning", aliases: ["ml", "scikit-learn", "sklearn", "model training", "xgboost"] },
  { name: "Deep learning", aliases: ["pytorch", "tensorflow", "keras", "neural network", "llm", "transformers", "nlp"] },
  { name: "Data engineering", aliases: ["etl", "elt", "airflow", "data pipeline", "dbt", "spark", "pyspark", "hadoop", "databricks"] },
  { name: "Data modelling", aliases: ["data modeling", "schema design", "feature engineering", "dimensional modelling"] },
  { name: "Statistics", aliases: ["statistical", "regression", "hypothesis testing", "a/b test", "ab testing"] },
  { name: "Notebooks", aliases: ["jupyter", "colab", "notebooks"] },
  { name: "Monitoring", aliases: ["observability", "grafana", "prometheus", "datadog", "sentry", "logging"] },
  { name: "Security", aliases: ["owasp", "encryption", "penetration testing", "vulnerability", "secure coding"] },
  { name: "Agile", aliases: ["scrum", "kanban", "sprint", "stand-ups", "jira"] },
  { name: "Mobile", aliases: ["react native", "flutter", "swift", "kotlin", "ios", "android"] },
  { name: "WebSockets", aliases: ["socket.io", "realtime", "real-time", "websocket"] },
  { name: "Payments", aliases: ["stripe", "paypal", "billing"] },
  { name: "Search", aliases: ["elasticsearch", "opensearch", "algolia", "solr"] },
  { name: "Linux", aliases: ["unix", "bash", "shell scripting", "command line"] }
];

/** How many times a skill is mentioned in the posting. */
function countMentions(text, skill) {
  const needles = [skill.name, ...skill.aliases];
  let count = 0;
  for (const needle of needles) {
    const re = new RegExp(aliasRegex(needle).source, "gi");
    count += (text.match(re) || []).length;
  }
  return count;
}

/**
 * A posting that mentions a skill once is asking for it; one that repeats it
 * is built around it. That repetition is the only honest signal we have
 * before the AI ranker exists, so weight 1-3 comes straight from frequency.
 */
function weightForMentions(count) {
  if (count >= 4) return 3;
  if (count >= 2) return 2;
  return 1;
}

/**
 * Pull the skills out of a job description.
 * Returns [] when the posting names no recognisable skills, which is the
 * caller's cue to fall back to DEFAULT_SKILLS.
 */
export function extractJobSkills(jobDescription) {
  const text = jobDescription || "";
  if (!text.trim()) return [];

  const found = [];
  for (const skill of SKILL_CATALOG) {
    const count = countMentions(text, skill);
    if (count > 0) {
      found.push({ name: skill.name, aliases: skill.aliases, weight: weightForMentions(count), mentions: count });
    }
  }

  // Most-demanded first, then alphabetical so equal weights stay stable.
  found.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));
  return found.slice(0, 20);
}
