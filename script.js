window.addEventListener("DOMContentLoaded", () => {
  // Extract YouTube video ID from any common format (watch, shorts, embed)
  function extractYouTubeId(link) {
    if (!link) return null;

    // 1. Shorts format → youtube.com/shorts/VIDEO_ID
    if (link.includes("youtube.com/shorts/")) {
      return link.split("/shorts/")[1].split(/[?&]/)[0];
    }

    // 2. Standard watch format → youtube.com/watch?v=VIDEO_ID
    if (link.includes("watch?v=")) {
      return link.split("watch?v=")[1].split("&")[0];
    }

    // 3. Embed format → youtube.com/embed/VIDEO_ID
    if (link.includes("/embed/")) {
      return link.split("/embed/")[1].split(/[?&]/)[0];
    }

    return null;
  }


  // Render music with YouTube embed
  const renderMusic = (m) => {
    const videoId = extractYouTubeId(m.link);
    if (!videoId) {
      return `
        <div class="card">
          <h3>${m.title}</h3>
          <p>${m.desc}</p>
        </div>
      `;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return `
      <div class="card">
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <div class="video-wrapper">
          <iframe 
            src="${embedUrl}" 
            frameborder="0" 
            allowfullscreen
            onerror="this.parentNode.innerHTML='<a href=\'https://www.youtube.com/watch?v=${videoId}\' target=\'_blank\'><img src=\'${thumbUrl}\' alt=\'${m.title}\'/><div class=\'btn\'>Watch on YouTube →</div></a>'"
          ></iframe>
        </div>
      </div>
    `;
  };

  // Render art with image + modal trigger
  const renderArt = (a) => `
    <div class="card">
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      ${a.link ? `<img src="${a.link}" alt="${a.title}" class="art-thumb" data-full="${a.link}" />` : ""}
    </div>
  `;

  // Render blog with external link
  const renderBlog = (b) => `
    <article class="card blog-card">
      <h3>${b.title}</h3>
      <blockquote class="blog-quote">${b.quote || ""}</blockquote>
      <p>${b.desc}</p>
      ${b.link ? `<a href="${b.link}" target="_blank" class="btn">Read More →</a>` : ""}
    </article>
  `;

  // Render career timeline
  const renderTimeline = (t) => {
    let listHTML = "";

    if (Array.isArray(t.desc)) {
      // If desc is already an array of points
      listHTML = `<ul>${t.desc.map(p => `<li>${p}</li>`).join("")}</ul>`;
    } else {
      // If desc is a string (fallback)
      const points = t.desc.split("\\n").map(p => p.trim()).filter(Boolean);
      listHTML = points.length > 1
        ? `<ul>${points.map(p => `<li>${p.replace(/^•\s*/, "")}</li>`).join("")}</ul>`
        : `<p>${t.desc}</p>`;
    }

    return `
      <li>
        <div class="timecard">
          <h3>${t.year} — ${t.title}</h3>
          ${listHTML}
          <span class="pill">${t.tag}</span>
        </div>
      </li>
    `;
  };

  async function loadContent() {
    let data;
    try {
      const res = await fetch("content.json");
      if (!res.ok) throw new Error("Network response not ok");
      data = await res.json();
    } catch (err) {
      console.warn("⚠ Could not load content.json, using fallback data:", err);

      // Fallback default content
      data = {
        hero: {
          title: "Building systems for airports,",
          subtitle: "and making art after hours.",
          lead: "Technical Lead & Project Manager with ~8 years in scalable backend systems. Also deeply into music, sketching, dance, and writing."
        },
        showcase: [
          {
            title: "Airport E-Commerce Platform",
            desc: "Check Pulse when in BIAL Airport.",
            tag: "Work",
            link: "https://www.bengaluruairport.com/"
          }
        ],
        timeline: [
          {
            "year": "2025 – ongoing",
            "title": "Multi-Airport Rollouts & Partner Integrations",
            "desc": [
              "Designed slot-based inventory for ADILX Lounge (San Francisco)",
              "Guided Skateboard rollouts across JFK (NY), CPH (Denmark), PHL (US)",
              "Built logging & surveillance module for debugging orders",
              "Integrated Loyalty Rewards for BIAL employees (multi-party system)",
              "Planning BIAL migration to Skateboard (cut-over strategy pending)",
              "Driving integrations across cabs, lounges, hotels, FnB, bot delivery",
              "Oversight of OSS compatibility, VAPT fixes, and maintenance"
            ],
            "tag": "Leadership",
            "link": ""
          },
          {
            "year": "2024 – 2025",
            "title": "Scaling Skateboard to SaaS",
            "desc": [
              "Forked PES into SaaS-ready Skateboard",
              "Expanded globally via Servy acquisition",
              "Supervised integrations & design reviews",
              "Coordinated new business opportunities & team alignment"
            ],
            "tag": "Scale",
            "link": ""
          },
          {
            "year": "2023 – 2024",
            "title": "First Client – BLR Airport",
            "desc": [
              "Deployed Skateboard + Store-Sense in continuous rollouts",
              "Mentored juniors to take on dev work while I led solutioning",
              "Parallel work on new integrations",
              "References: BLR websites & mobile apps"
            ],
            "tag": "Deployment",
            "link": "https://www.bengaluruairport.com/"
          },
          {
            "year": "2021 – 2022",
            "title": "Products in Airport Domain",
            "desc": [
              "Architected PES (multi-merchant app for Cab, FnB, Lounge, Events, Flights and more...)",
              "Designed & coded backend system from scratch",
              "Store Sense: POS-based analytics for airport sales",
              "Portals for stores, airports, admins (later pivoted to S3/API ingestion)"
            ],
            "tag": "Product",
            "link": ""
          },
          {
            "year": "2017 – 2020",
            "title": "Foundations & Transition to Backend",
            "desc": [
              "Built BI dashboards with QlikSense & Pentaho",
              "Developed Car Parking RMS pricing module (Java-MySQL)",
              "Designed resource allocation algorithm for global breweries (Python, $100M project)",
              "Inducted into product engineering team for PES"
            ],
            "tag": "Foundations",
            "link": ""
          }
        ]
,
        "music": [
          {
            "title": "Besura | #113 | Lukka chhuppi",
            "desc": "Raw emotions",
            "link": "https://www.youtube.com/shorts/tJ600V3s4u8"
          },
          {
            "title": "Acoustic Cover",
            "desc": "Sapno ki Rani",
            "link": "https://www.youtube.com/watch?v=mPT0Ix5eSLU"
          }
        ],
        "art": [
          {
            "title": "Medusa",
            "desc": "My Horcrux, I put my soul into this.",
            "link": "assets/medusa.jpg"
          },
          {
            "title": "Digital Abstract",
            "desc": "Neon textures & light.",
            "link": "assets/eye.jpg"
          }
        ],
        "blog": [
          {
            "title": "Key to Successful Professional Life",
            "desc": "It is better to live a life of 'Oh! Well...' than 'What If!!'.",
            "quote": "The most valuable gift you have to offer is yourself; and the key to effective giving is to stay open to receiving",
            "link": "https://sinhappranav.blogspot.com/2019/02/key-to-successful-professional-life.html"
          },
          {
            "title": "Inside Out",
            "desc": "Fear, Anger, Joy, Disgust and Sadness.",
            "quote": "Befriend your core-emotions; know them Inside-Out and it will change the way you look at things and yourself",
            "link": "https://sinhappranav.blogspot.com/2019/03/inside-out.html"
          }
        ]
,
        contact: {
          email: "pranavpsinha@duck.com",
          socials: {
            GitHub: "https://github.com/pranavpsinha",
            LinkedIn: "https://www.linkedin.com/in/pranavpsinha/",
          }
        }
      };
    }

    // Footer year
    document.getElementById("year").textContent = new Date().getFullYear();

    // Build Navigation
    const nav = document.getElementById("mainNav");
    const sections = ["Home", "Work", "Music", "Art", "Blog", "Contact"];
    nav.innerHTML = sections.map(s => `<a href="#${s.toLowerCase()}">${s}</a>`).join("");

    // Helper: render card with optional link
    const renderCard = (item) => {
      const content = `
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        ${item.tag ? `<span class="pill">${item.tag}</span>` : ""}
      `;
      if (item.link && item.link.trim() !== "") {
        return `<a class="card" href="${item.link}" target="_blank">${content}</a>`;
      } else {
        return `<div class="card">${content}</div>`;
      }
    };

    // Helper: render timeline with bullet points
    const renderTimeline = (t) => {
      // Split desc by newline → bullets
      const points = t.desc.split("\n").map(p => p.trim()).filter(Boolean);
      const listHTML = points.length > 1
        ? `<ul>${points.map(p => `<li>${p.replace(/^•\s*/, "")}</li>`).join("")}</ul>`
        : `<p>${t.desc}</p>`;

      return `
        <li>
          <div class="timecard">
            <h3>${t.year} — ${t.title}</h3>
            ${listHTML}
            <span class="pill">${t.tag}</span>
          </div>
        </li>
      `;
    };

    // Build Content Sections
    const main = document.getElementById("content");
    main.innerHTML = `
      <section id="home" class="hero">
        <h1>${data.hero.title}<br><span class="accent">${data.hero.subtitle}</span></h1>
        <p>${data.hero.lead}</p>
      </section>

      <section id="showcase">
        <h2>Highlights</h2>
        <div class="grid">
          ${data.showcase.map(renderCard).join("")}
        </div>
      </section>

      <section id="work">
        <h2>Timeline</h2>
        <ol class="timeline">
          ${data.timeline.map(renderTimeline).join("")}
        </ol>
      </section>

      <section id="music">
        <h2>Music</h2>
        <div class="grid">
          ${data.music.map(renderMusic).join("")}
        </div>
      </section>

      <section id="art">
        <h2>Art</h2>
        <div class="grid">
          ${data.art.map(renderArt).join("")}
        </div>
      </section>

      <section id="blog">
        <h2>Blog</h2>
        <div class="grid">
          ${data.blog.map(renderBlog).join("")}
        </div>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>Email: <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
        <p>
          ${
            Object.entries(data.contact.socials)
            .map(([k,v]) => `<a href="${v}" target="_blank" rel="noopener noreferrer">${k}</a>`)
            .join(" | ")
          }
        </p>
      </section>
    `;

    // Mobile Nav Toggle
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        mainNav.classList.toggle("open");
      });
    }

    // Modal viewer for Art images
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("imgModalContent");
    const captionText = document.getElementById("imgCaption");
    const closeBtn = document.querySelector(".modal .close");

    // Open modal when thumbnail clicked
    document.querySelectorAll(".art-thumb").forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = img.dataset.full;
        captionText.textContent = img.alt;
      });
    });

    // Close modal
    if (closeBtn) {
      closeBtn.onclick = () => { modal.style.display = "none"; };
    }

    // Close modal on outside click
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }

  loadContent();
});