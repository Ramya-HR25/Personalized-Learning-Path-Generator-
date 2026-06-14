// Course Catalog Generator - Generates 60+ CS courses with complete structure

export const courseCategories = {
  "Programming Languages": ["C Programming", "C++ Programming", "Java Programming", "Python Programming", "Object Oriented Programming"],
  "Core CS": ["Data Structures", "Advanced Data Structures", "Design and Analysis of Algorithms", "Discrete Mathematics", "Engineering Mathematics", "Probability and Statistics", "Linear Algebra"],
  "Systems": ["Computer Organization", "Computer Architecture", "Operating Systems", "Database Management Systems", "Advanced Database Systems", "Computer Networks", "Advanced Computer Networks"],
  "Theory": ["Automata Theory", "Compiler Design"],
  "Software Engineering": ["Software Engineering", "Software Testing", "Agile Methodology", "Software Project Management", "System Design"],
  "Web Technologies": ["Web Technologies", "HTML", "CSS", "JavaScript", "TypeScript", "Bootstrap", "React JS", "Angular JS", "Vue JS", "Next JS", "Node JS", "Express JS", "PHP", "Django Framework", "REST API Development"],
  "Data Science & AI": ["Machine Learning", "Artificial Intelligence", "Deep Learning", "Data Mining", "Data Science", "Natural Language Processing", "Computer Vision", "Pattern Recognition", "Big Data Analytics", "Generative AI"],
  "Big Data & Cloud": ["Hadoop", "Apache Spark", "Cloud Computing", "Distributed Systems", "Virtualization", "Containerization (Docker)", "Microservices Architecture"],
  "IoT & Embedded": ["Internet of Things (IoT)", "Embedded Systems", "Microcontrollers", "Edge Computing"],
  "Security": ["Cyber Security", "Cryptography", "Network Security", "Information Security", "Ethical Hacking", "Digital Forensics"],
  "Mobile Dev": ["Android Development", "Kotlin Programming", "Mobile Application Development", "Flutter Development", "React Native"],
  "DevOps & Tools": ["Unix Programming", "Linux Operating System", "Shell Scripting", "Version Control using Git", "GitHub Collaboration", "DevOps Basics", "MLOps"],
  "Math & Graphics": ["Human Computer Interaction", "Computer Graphics", "Image Processing", "Information Retrieval"],
  "Emerging Tech": ["Blockchain Technology", "Recommendation Systems", "Parallel Computing", "High Performance Computing", "Quantum Computing Basics"]
};

// Helper function to create a topic
function createTopic(id, title, subtopics, resources, durationMinutes = 120) {
  return {
    id,
    title,
    durationMinutes,
    completionRules: { videoPercentage: 70, readMinutes: 10 },
    subtopics,
    resources
  };
}

// Helper function to create a resource
function createResource(id, type, title, url, durationMinutes = 30, summary = "", focusPoints = [], quizFacts = []) {
  return { id, type, title, url, durationMinutes, summary, focusPoints, quizFacts };
}

// Course templates for different categories
function generateProgrammingCourse(subject, key) {
  const keyShort = key.toLowerCase().replace(/\s+/g, '-');
  return {
    title: `${subject} Mastery Path`,
    overview: `Master ${subject.toLowerCase()} from fundamentals to advanced concepts with hands-on projects and real-world applications.`,
    estimatedHours: 35,
    chapters: [
      {
        id: `${keyShort}-ch1`,
        title: "Foundations",
        description: `Learn ${subject.toLowerCase()} syntax, data types, and core programming constructs.`,
        topics: [
          createTopic(`${keyShort}-t1`, "Syntax and Basics", 
            ["Variables", "Data Types", "Operators", "Input/Output"],
            [
              createResource(`res-${keyShort}-1`, "video", `${subject} Crash Course`, "https://www.youtube.com/watch?v=8ext9G7xspg", 60),
              createResource(`res-${keyShort}-2`, "article", `${subject} Basics Guide`, "https://www.geeksforgeeks.org/", 20),
              createResource(`res-${keyShort}-3`, "pdf", `${subject} Quick Reference`, "https://roadmap.sh/", 25)
            ]
          ),
          createTopic(`${keyShort}-t2`, "Control Flow and Functions",
            ["Conditionals", "Loops", "Functions", "Scope"],
            [
              createResource(`res-${keyShort}-4`, "video", "Functions and Control Structures", "https://www.youtube.com/watch?v=rfscVS0vtbw", 45),
              createResource(`res-${keyShort}-5`, "course", `${subject} Essentials`, "https://www.freecodecamp.org/learn/", 40),
              createResource(`res-${keyShort}-6`, "article", "Function Best Practices", "https://www.geeksforgeeks.org/", 25)
            ]
          )
        ]
      },
      {
        id: `${keyShort}-ch2`,
        title: "Advanced Concepts",
        description: "Deep dive into advanced features, OOP principles, and best practices.",
        topics: [
          createTopic(`${keyShort}-t3`, "Object-Oriented Programming",
            ["Classes", "Objects", "Inheritance", "Polymorphism"],
            [
              createResource(`res-${keyShort}-7`, "video", "OOP in " + subject, "https://www.youtube.com/watch?v=pTB0EiLXUC8", 50),
              createResource(`res-${keyShort}-8`, "article", "OOP Concepts Explained", "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept/", 30),
              createResource(`res-${keyShort}-9`, "pdf", "OOP Design Patterns", "https://refactoring.guru/design-patterns", 35)
            ]
          ),
          createTopic(`${keyShort}-t4`, "Projects and Best Practices",
            ["File Handling", "Error Handling", "Debugging", "Project Structure"],
            [
              createResource(`res-${keyShort}-10`, "course", `${subject} Projects`, "https://www.youtube.com/watch?v=8ext9G7xspg", 60),
              createResource(`res-${keyShort}-11`, "article", `${subject} Interview Questions`, "https://www.geeksforgeeks.org/", 30),
              createResource(`res-${keyShort}-12`, "pdf", "Best Practices Guide", "https://roadmap.sh/", 35)
            ]
          )
        ]
      }
    ]
  };
}

function generateWebDevCourse(subject, key) {
  const keyShort = key.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '').replace(/\+/g, 'plus').replace(/\s/g, '-');
  return {
    title: `${subject} Complete Guide`,
    overview: `Build modern web applications with ${subject.toLowerCase()}. Learn from basics to deployment with practical examples.`,
    estimatedHours: 30,
    chapters: [
      {
        id: `${keyShort}-ch1`,
        title: "Core Concepts",
        description: `Master the fundamentals of ${subject.toLowerCase()}.`,
        topics: [
          createTopic(`${keyShort}-t1`, `${subject} Fundamentals`,
            ["Basics", "Syntax", "Core Features", "Best Practices"],
            [
              createResource(`res-${keyShort}-1`, "video", `${subject} Tutorial for Beginners`, "https://www.youtube.com/watch?v=UB1O30fR-EE", 60),
              createResource(`res-${keyShort}-2`, "article", `${subject} Documentation`, "https://developer.mozilla.org/", 25),
              createResource(`res-${keyShort}-3`, "course", `${subject} Essentials`, "https://www.freecodecamp.org/learn/", 40)
            ]
          )
        ]
      },
      {
        id: `${keyShort}-ch2`,
        title: "Practical Applications",
        description: "Build real-world projects and learn deployment.",
        topics: [
          createTopic(`${keyShort}-t2`, "Project Development",
            ["Project Setup", "Implementation", "Testing", "Deployment"],
            [
              createResource(`res-${keyShort}-4`, "video", "Build a Project with " + subject, "https://www.youtube.com/watch?v=bMknfKXIFA8", 70),
              createResource(`res-${keyShort}-5`, "article", "Deployment Guide", "https://roadmap.sh/", 30),
              createResource(`res-${keyShort}-6`, "pdf", "Project Templates", "https://github.com/", 35)
            ]
          )
        ]
      }
    ]
  };
}

function generateDataScienceCourse(subject, key) {
  const keyShort = key.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus').replace(/\s/g, '-');
  return {
    title: `${subject} Professional Path`,
    overview: `Comprehensive ${subject.toLowerCase()} course covering theory, practical implementation, and industry applications.`,
    estimatedHours: 45,
    chapters: [
      {
        id: `${keyShort}-ch1`,
        title: "Foundations",
        description: "Mathematical foundations and core concepts.",
        topics: [
          createTopic(`${keyShort}-t1`, `${subject} Basics`,
            ["Introduction", "Core Concepts", "Mathematical Foundation", "Tools Setup"],
            [
              createResource(`res-${keyShort}-1`, "video", `${subject} Introduction`, "https://www.youtube.com/watch?v=aircAruvnKk", 60),
              createResource(`res-${keyShort}-2`, "article", `${subject} Fundamentals`, "https://www.geeksforgeeks.org/", 30),
              createResource(`res-${keyShort}-3`, "course", `${subject} Course`, "https://www.coursera.org/", 50)
            ]
          )
        ]
      },
      {
        id: `${keyShort}-ch2`,
        title: "Advanced Techniques",
        description: "Advanced algorithms and real-world applications.",
        topics: [
          createTopic(`${keyShort}-t2`, "Implementation",
            ["Algorithms", "Model Building", "Evaluation", "Optimization"],
            [
              createResource(`res-${keyShort}-4`, "video", "Advanced " + subject, "https://www.youtube.com/watch?v=VyWAvY2CF9c", 65),
              createResource(`res-${keyShort}-5`, "article", "Implementation Guide", "https://machinelearningmastery.com/", 35),
              createResource(`res-${keyShort}-6`, "pdf", "Case Studies", "https://www.kaggle.com/", 40)
            ]
          ),
          createTopic(`${keyShort}-t3`, "Projects and Deployment",
            ["Real Projects", "Model Deployment", "Monitoring", "Best Practices"],
            [
              createResource(`res-${keyShort}-7`, "course", `${subject} Projects`, "https://www.kaggle.com/learn/", 60),
              createResource(`res-${keyShort}-8`, "article", "Deployment Tutorial", "https://www.analyticsvidhya.com/", 30),
              createResource(`res-${keyShort}-9`, "pdf", "Industry Applications", "https://roadmap.sh/ai-data-scientist", 40)
            ]
          )
        ]
      }
    ]
  };
}

function generateSystemsCourse(subject, key) {
  const keyShort = key.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus').replace(/\s/g, '-');
  const profile = getSystemsSubjectProfile(subject);
  return {
    title: `${subject} Deep Dive`,
    overview: `Understand ${subject.toLowerCase()} internals, architecture, and practical implementation.`,
    estimatedHours: profile.estimatedHours || 38,
    chapters: profile.chapters.map((chapter, chapterIndex) => ({
      id: `${keyShort}-ch${chapterIndex + 1}`,
      title: chapter.title,
      description: chapter.description,
      topics: chapter.topics.map((topic, topicIndex) =>
        createTopic(
          `${keyShort}-t${(chapterIndex * 2) + topicIndex + 1}`,
          topic.title,
          topic.subtopics,
          topic.resources.map((resource, resourceIndex) =>
            createResource(
              `res-${keyShort}-${(chapterIndex * 6) + (topicIndex * 3) + resourceIndex + 1}`,
              resource.type,
              resource.title,
              resource.url,
              resource.durationMinutes,
              resource.summary,
              resource.focusPoints,
              resource.quizFacts
            )
          )
        )
      )
    }))
  };
}

function buildLearningResourceSet(resourceBase, urls) {
  return [
    {
      type: "video",
      title: `${resourceBase} Walkthrough`,
      url: urls.video,
      durationMinutes: 55,
      summary: `Video walkthrough covering ${resourceBase.toLowerCase()} in a structured way.`,
      focusPoints: urls.focusPoints,
      quizFacts: urls.quizFacts || []
    },
    {
      type: "article",
      title: `${resourceBase} Guide`,
      url: urls.article,
      durationMinutes: 30,
      summary: `Article reference for ${resourceBase.toLowerCase()} with definitions and practical notes.`,
      focusPoints: urls.focusPoints,
      quizFacts: urls.quizFacts || []
    },
    {
      type: "pdf",
      title: `${resourceBase} Notes`,
      url: urls.pdf,
      durationMinutes: 35,
      summary: `Condensed PDF notes for ${resourceBase.toLowerCase()} and revision.`,
      focusPoints: urls.focusPoints,
      quizFacts: urls.quizFacts || []
    }
  ];
}

function getSystemsSubjectProfile(subject) {
  const normalized = subject.toLowerCase();

  if (normalized.includes("network")) {
    return {
      estimatedHours: 42,
      chapters: [
        {
          title: "Protocol Architecture and Communication Models",
          description: "Study how modern networks are layered, addressed, and coordinated.",
          topics: [
            {
              title: "Network Models and Layering",
              subtopics: ["OSI model", "TCP/IP stack", "Encapsulation", "Cross-layer design"],
              resources: buildLearningResourceSet(`${subject} Protocol Stack`, {
                video: "https://www.youtube.com/results?search_query=advanced+computer+networks+protocol+stack",
                article: "https://www.geeksforgeeks.org/basics-computer-networking/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["OSI model", "TCP/IP stack", "Encapsulation", "Cross-layer design"],
                quizFacts: [
                  {
                    prompt: "Which model uses seven layers including physical, data link, and transport?",
                    answer: "OSI model",
                    distractors: ["TCP/IP stack", "Cross-layer design", "Circuit switching"],
                    explanation: "The OSI model is the seven-layer conceptual framework used to describe network communication."
                  },
                  {
                    prompt: "Which networking stack is used in real-world Internet implementations?",
                    answer: "TCP/IP stack",
                    distractors: ["OSI model", "Token ring stack", "Cross-layer design"],
                    explanation: "TCP/IP is the practical protocol stack used on the Internet."
                  },
                  {
                    prompt: "What is the term for wrapping data with protocol information as it moves down the layers?",
                    answer: "Encapsulation",
                    distractors: ["Virtualization", "Segmentation", "Broadcasting"],
                    explanation: "Encapsulation adds headers and trailers as data passes through network layers."
                  }
                ]
              })
            },
            {
              title: "Routing, Switching, and Traffic Flow",
              subtopics: ["Routing protocols", "Switching techniques", "Congestion control", "Quality of Service"],
              resources: buildLearningResourceSet(`${subject} Routing and Traffic`, {
                video: "https://www.youtube.com/results?search_query=advanced+computer+networks+routing+traffic+engineering",
                article: "https://www.geeksforgeeks.org/computer-network-tutorials/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["Routing protocols", "Switching techniques", "Congestion control", "Quality of Service"],
                quizFacts: [
                  {
                    prompt: "Which concept is used to select paths for forwarding packets between networks?",
                    answer: "Routing protocols",
                    distractors: ["Flow control", "Encapsulation", "Virtual memory"],
                    explanation: "Routing protocols determine how routers discover and choose packet paths."
                  },
                  {
                    prompt: "Which mechanism is used to reduce overload when traffic exceeds network capacity?",
                    answer: "Congestion control",
                    distractors: ["Address translation", "Process synchronization", "Disk scheduling"],
                    explanation: "Congestion control prevents and mitigates overload in packet-switched networks."
                  },
                  {
                    prompt: "Which concept is responsible for prioritizing traffic classes such as voice and video?",
                    answer: "Quality of Service",
                    distractors: ["Error recovery", "Cross-layer design", "Normalization"],
                    explanation: "Quality of Service applies prioritization and performance guarantees for selected traffic."
                  }
                ]
              })
            }
          ]
        },
        {
          title: "Scalable Network Design and Modern Deployment",
          description: "Connect theory to implementation through transport, control, and modern network operations.",
          topics: [
            {
              title: "Transport and Reliability",
              subtopics: ["Flow control", "Error recovery", "TCP optimization", "Reliable delivery"],
              resources: buildLearningResourceSet(`${subject} Transport Reliability`, {
                video: "https://www.youtube.com/results?search_query=transport+layer+tcp+reliability+advanced+computer+networks",
                article: "https://www.geeksforgeeks.org/transport-layer-in-computer-network/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["Flow control", "Error recovery", "TCP optimization", "Reliable delivery"],
                quizFacts: [
                  {
                    prompt: "Which transport-layer mechanism prevents a sender from overwhelming a receiver?",
                    answer: "Flow control",
                    distractors: ["Congestion control", "Routing protocols", "Packet switching"],
                    explanation: "Flow control matches the sending rate to the receiver's processing capacity."
                  },
                  {
                    prompt: "Which function resends lost or corrupted transport data to maintain correctness?",
                    answer: "Error recovery",
                    distractors: ["Quality of Service", "Load balancing", "Cross-layer design"],
                    explanation: "Error recovery uses acknowledgements and retransmissions to preserve reliability."
                  },
                  {
                    prompt: "What is the goal of TCP optimization in high-performance networks?",
                    answer: "Improve throughput and latency behavior",
                    distractors: ["Replace all routing protocols", "Disable reliability", "Remove packet headers"],
                    explanation: "TCP optimization tunes transport behavior to improve delivery efficiency and responsiveness."
                  }
                ]
              })
            },
            {
              title: "Software-Defined and Secure Networking",
              subtopics: ["SDN controllers", "Network virtualization", "Network security", "Performance monitoring"],
              resources: buildLearningResourceSet(`${subject} Modern Network Operations`, {
                video: "https://www.youtube.com/results?search_query=software+defined+networking+network+virtualization+tutorial",
                article: "https://www.geeksforgeeks.org/software-defined-networking-sdn/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["SDN controllers", "Network virtualization", "Network security", "Performance monitoring"],
                quizFacts: [
                  {
                    prompt: "Which SDN component centrally programs forwarding behavior in the data plane?",
                    answer: "SDN controllers",
                    distractors: ["Routing loops", "Packet buffers", "Disk schedulers"],
                    explanation: "SDN controllers separate the control plane and manage forwarding decisions centrally."
                  },
                  {
                    prompt: "What allows multiple logical networks to share the same physical infrastructure?",
                    answer: "Network virtualization",
                    distractors: ["Error recovery", "Flow control", "Segmentation"],
                    explanation: "Network virtualization abstracts the physical network into multiple logical environments."
                  },
                  {
                    prompt: "Which activity measures latency, throughput, and anomalies to keep a network healthy?",
                    answer: "Performance monitoring",
                    distractors: ["Normalization", "Thread scheduling", "Deadlock prevention"],
                    explanation: "Performance monitoring tracks metrics and signals problems in modern networks."
                  }
                ]
              })
            }
          ]
        }
      ]
    };
  }

  if (normalized.includes("database")) {
    return {
      estimatedHours: 40,
      chapters: [
        {
          title: "Data Modeling and Query Foundations",
          description: "Build a strong understanding of relational design and query processing.",
          topics: [
            {
              title: "Relational Modeling",
              subtopics: ["ER modeling", "Normalization", "Keys and constraints", "Schema design"],
              resources: buildLearningResourceSet(`${subject} Relational Modeling`, {
                video: "https://www.youtube.com/results?search_query=database+normalization+er+model+tutorial",
                article: "https://www.geeksforgeeks.org/dbms/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["ER modeling", "Normalization", "Keys and constraints", "Schema design"]
              })
            },
            {
              title: "SQL and Query Execution",
              subtopics: ["SQL joins", "Aggregation", "Indexes", "Query optimization"],
              resources: buildLearningResourceSet(`${subject} Query Execution`, {
                video: "https://www.youtube.com/results?search_query=sql+joins+query+optimization+tutorial",
                article: "https://www.geeksforgeeks.org/sql-tutorial/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["SQL joins", "Aggregation", "Indexes", "Query optimization"]
              })
            }
          ]
        },
        {
          title: "Transactions, Scale, and Reliability",
          description: "Explore how databases stay correct, available, and fast at scale.",
          topics: [
            {
              title: "Transactions and Concurrency",
              subtopics: ["ACID properties", "Locking", "Isolation levels", "Deadlocks"],
              resources: buildLearningResourceSet(`${subject} Transactions`, {
                video: "https://www.youtube.com/results?search_query=database+transactions+concurrency+control",
                article: "https://www.geeksforgeeks.org/dbms-transactions/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["ACID properties", "Locking", "Isolation levels", "Deadlocks"]
              })
            },
            {
              title: "Distributed and Advanced Databases",
              subtopics: ["Replication", "Sharding", "CAP theorem", "Recovery mechanisms"],
              resources: buildLearningResourceSet(`${subject} Distributed Systems`, {
                video: "https://www.youtube.com/results?search_query=distributed+database+replication+sharding",
                article: "https://www.geeksforgeeks.org/distributed-dbms/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["Replication", "Sharding", "CAP theorem", "Recovery mechanisms"]
              })
            }
          ]
        }
      ]
    };
  }

  if (normalized.includes("operating system")) {
    return {
      estimatedHours: 42,
      chapters: [
        {
          title: "Processes, Scheduling, and Coordination",
          description: "Understand how the operating system manages execution and concurrency.",
          topics: [
            {
              title: "Processes and Threads",
              subtopics: ["Process lifecycle", "Threads", "Context switching", "CPU scheduling"],
              resources: buildLearningResourceSet(`${subject} Process Management`, {
                video: "https://www.youtube.com/results?search_query=operating+systems+processes+threads+scheduling",
                article: "https://www.geeksforgeeks.org/operating-systems/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["Process lifecycle", "Threads", "Context switching", "CPU scheduling"]
              })
            },
            {
              title: "Synchronization and Deadlocks",
              subtopics: ["Semaphores", "Monitors", "Critical section", "Deadlock prevention"],
              resources: buildLearningResourceSet(`${subject} Synchronization`, {
                video: "https://www.youtube.com/results?search_query=operating+systems+synchronization+deadlocks",
                article: "https://www.geeksforgeeks.org/process-synchronization-in-operating-system/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["Semaphores", "Monitors", "Critical section", "Deadlock prevention"]
              })
            }
          ]
        },
        {
          title: "Memory, Storage, and System Services",
          description: "Study memory hierarchy, files, and the core services behind stable systems.",
          topics: [
            {
              title: "Memory Management",
              subtopics: ["Paging", "Segmentation", "Virtual memory", "Page replacement"],
              resources: buildLearningResourceSet(`${subject} Memory Management`, {
                video: "https://www.youtube.com/results?search_query=operating+systems+virtual+memory+paging",
                article: "https://www.geeksforgeeks.org/memory-management-in-operating-system/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["Paging", "Segmentation", "Virtual memory", "Page replacement"]
              })
            },
            {
              title: "File Systems and I/O",
              subtopics: ["File organization", "Disk scheduling", "Buffer cache", "Device management"],
              resources: buildLearningResourceSet(`${subject} File Systems`, {
                video: "https://www.youtube.com/results?search_query=operating+systems+file+systems+disk+scheduling",
                article: "https://www.geeksforgeeks.org/file-system-in-operating-system/",
                pdf: "https://roadmap.sh/",
                focusPoints: ["File organization", "Disk scheduling", "Buffer cache", "Device management"]
              })
            }
          ]
        }
      ]
    };
  }

  return {
    estimatedHours: 38,
    chapters: [
      {
        title: "Core Concepts and Foundations",
        description: `Learn the foundational principles that shape ${subject.toLowerCase()}.`,
        topics: [
          {
            title: `${subject} Core Concepts`,
            subtopics: ["Fundamental principles", "Architecture", "Key components", "Design trade-offs"],
            resources: buildLearningResourceSet(`${subject} Core Concepts`, {
              video: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " fundamentals tutorial")}`,
              article: "https://www.geeksforgeeks.org/",
              pdf: "https://roadmap.sh/",
              focusPoints: ["Fundamental principles", "Architecture", "Key components", "Design trade-offs"]
            })
          },
          {
            title: `${subject} Analysis and Practice`,
            subtopics: ["Implementation patterns", "Performance factors", "Practical scenarios", "Optimization"],
            resources: buildLearningResourceSet(`${subject} Practice and Analysis`, {
              video: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " practical implementation")}`,
              article: "https://www.geeksforgeeks.org/",
              pdf: "https://roadmap.sh/",
              focusPoints: ["Implementation patterns", "Performance factors", "Practical scenarios", "Optimization"]
            })
          }
        ]
      },
      {
        title: "Applied Design and Optimization",
        description: `Connect the theory of ${subject.toLowerCase()} to real implementation choices.`,
        topics: [
          {
            title: `${subject} Design Decisions`,
            subtopics: ["System design", "Operational constraints", "Testing approaches", "Reliability"],
            resources: buildLearningResourceSet(`${subject} Design Decisions`, {
              video: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " design tutorial")}`,
              article: "https://www.geeksforgeeks.org/",
              pdf: "https://roadmap.sh/",
              focusPoints: ["System design", "Operational constraints", "Testing approaches", "Reliability"]
            })
          },
          {
            title: `${subject} Deployment and Improvement`,
            subtopics: ["Deployment workflow", "Monitoring", "Debugging", "Continuous improvement"],
            resources: buildLearningResourceSet(`${subject} Deployment`, {
              video: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " deployment optimization tutorial")}`,
              article: "https://www.geeksforgeeks.org/",
              pdf: "https://roadmap.sh/",
              focusPoints: ["Deployment workflow", "Monitoring", "Debugging", "Continuous improvement"]
            })
          }
        ]
      }
    ]
  };
}

function generateSecurityCourse(subject, key) {
  const keyShort = key.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus').replace(/\s/g, '-');
  return {
    title: `${subject} Complete Course`,
    overview: `Master ${subject.toLowerCase()} with hands-on labs, real-world scenarios, and industry best practices.`,
    estimatedHours: 40,
    chapters: [
      {
        id: `${keyShort}-ch1`,
        title: "Security Fundamentals",
        description: "Core security concepts and threat landscape.",
        topics: [
          createTopic(`${keyShort}-t1`, `${subject} Basics`,
            ["Introduction", "Threat Models", "Security Principles", "Tools"],
            [
              createResource(`res-${keyShort}-1`, "video", `${subject} for Beginners`, "https://www.youtube.com/watch?v=inWWhr5tnEA", 50),
              createResource(`res-${keyShort}-2`, "article", `${subject} Concepts`, "https://www.cybr.com/", 25),
              createResource(`res-${keyShort}-3`, "course", `${subject} Fundamentals`, "https://www.coursera.org/", 45)
            ]
          )
        ]
      },
      {
        id: `${keyShort}-ch2`,
        title: "Advanced Security",
        description: "Advanced techniques and real-world applications.",
        topics: [
          createTopic(`${keyShort}-t2`, "Practical Security",
            ["Penetration Testing", "Vulnerability Assessment", "Incident Response", "Compliance"],
            [
              createResource(`res-${keyShort}-4`, "video", "Advanced " + subject, "https://www.youtube.com/watch?v=3Kq1MquTWRs", 65),
              createResource(`res-${keyShort}-5`, "article", "Security Tools Guide", "https://www.kali.org/", 35),
              createResource(`res-${keyShort}-6`, "pdf", "Security Frameworks", "https://www.nist.gov/", 40)
            ]
          )
        ]
      }
    ]
  };
}

// Main generator function
export function generateAllCourses() {
  const catalog = {};
  
  // Generate courses for each category
  Object.entries(courseCategories).forEach(([category, subjects]) => {
    subjects.forEach(subject => {
      let courseData;
      
      // Select appropriate template based on category
      if (category === "Programming Languages") {
        courseData = generateProgrammingCourse(subject, subject);
      } else if (category === "Web Technologies") {
        courseData = generateWebDevCourse(subject, subject);
      } else if (category === "Data Science & AI") {
        courseData = generateDataScienceCourse(subject, subject);
      } else if (category === "Systems" || category === "Theory" || category === "Big Data & Cloud" || category === "IoT & Embedded") {
        courseData = generateSystemsCourse(subject, subject);
      } else if (category === "Security") {
        courseData = generateSecurityCourse(subject, subject);
      } else if (category === "Mobile Dev") {
        courseData = generateWebDevCourse(subject, subject);
      } else if (category === "DevOps & Tools") {
        courseData = generateSystemsCourse(subject, subject);
      } else if (category === "Math & Graphics" || category === "Software Engineering") {
        courseData = generateSystemsCourse(subject, subject);
      } else if (category === "Emerging Tech") {
        courseData = generateDataScienceCourse(subject, subject);
      } else if (category === "Core CS") {
        courseData = generateSystemsCourse(subject, subject);
      } else {
        // Default template
        courseData = generateProgrammingCourse(subject, subject);
      }
      
      catalog[subject] = courseData;
    });
  });
  
  return catalog;
}
