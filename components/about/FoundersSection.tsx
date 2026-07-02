"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Dr. Lina Aboutouk",
    role: "Founder Partner",
    photo: "/Team/Lina.jpeg",
    photoPosition: "object-top",
    bio: "Dr. Lina Aboutouk is a Founder Partner of Hayya Med Pro with a background in healthcare, educational leadership, operations management, and professional development. She brings extensive experience in stakeholder engagement, organizational coordination, governance, and capability-building initiatives. Her work focuses on creating structured, user-centered experiences that support healthcare professionals throughout their professional development journey. As a Founder Partner, Dr. Aboutouk plays an important role in guiding professional engagement strategies, operational excellence, education-focused initiatives, and healthcare workforce development programs. Her commitment to quality, collaboration, and continuous learning contributes significantly to the platform's mission and growth.",
  },
  {
    name: "Dr. Khaled Sadeddine",
    role: "Founder Partner",
    photo: "/Team/Khaled.jpeg",
    photoPosition: "object-top",
    bio: "Dr. Khaled Sadeddine is a Founder Partner of Hayya Med Pro and a seasoned enterprise transformation leader with extensive experience in management consulting, innovation strategy, organizational development, and business transformation. Over the course of his career, he has led and supported large-scale transformation initiatives, innovation programs, and startup ecosystem development efforts across multiple sectors. His expertise includes strategic planning, technology adoption, operational improvement, and growth acceleration. As a Founder Partner, Dr. Sadeddine contributes to the platform's long-term vision, innovation strategy, organizational scalability, and transformation roadmap. His experience in building innovation ecosystems and supporting entrepreneurship initiatives helps strengthen Hayya Med Pro's position as a forward-looking healthcare technology platform.",
  },
  {
    name: "Abbas Al Masri",
    role: "Founder Partner",
    photo: "/Team/abbas.jpeg",
    photoPosition: "object-contain object-bottom",
    bio: "Abbas Al Masri is a Founder Partner of Hayya Med Pro and an experienced business leader with a strong background in healthcare operations, business development, strategic partnerships, and organizational growth. Throughout his career, he has held senior leadership roles within Qatar's healthcare sector, including serving as Chief Operating Officer of leading healthcare organizations. His experience spans healthcare management, operational excellence, commercial strategy, and stakeholder engagement. Abbas is also the Chief Executive Officer of Hayya Med AI, where he leads initiatives focused on artificial intelligence, digital transformation, enterprise technology, and innovation. His vision for Hayya Med Pro is centered on simplifying healthcare compliance, supporting professional development, and creating smarter digital solutions for healthcare professionals and organizations. As a Founder Partner, he contributes to the strategic direction, ecosystem development, growth initiatives, and long-term expansion of the platform.",
  },
];

const CARD_GRADIENT = "linear-gradient(160deg, #060c1a 0%, #0d1f40 45%, #1a3a6e 100%)";
const CARD_CONTENT_BG = "linear-gradient(180deg, #0a1628 0%, #0d1e3c 100%)";

export default function FoundersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 sm:px-6 bg-[#0f1f3d]" ref={sectionRef}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold text-[#93c5fd] uppercase tracking-[0.22em] mb-3">
            Leadership
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Founding Team
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent mx-auto mb-5" />
          <p className="text-sm text-[#8ea5c8] max-w-xl mx-auto leading-relaxed">
            Built by leaders with deep roots in GCC healthcare operations, enterprise
            transformation, and professional development.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 48 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.75,
                delay: 0.15 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              className="flex flex-col overflow-hidden rounded-2xl cursor-default"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
            >
              {/* Photo container — same navy gradient for all */}
              <div
                className="relative overflow-hidden"
                style={{ height: 300, background: CARD_GRADIENT }}
              >
                {/* Subtle grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 32px)," +
                      "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 32px)",
                  }}
                />
                {/* Radial glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 75% 80% at 50% 55%, rgba(26,86,160,0.38) 0%, transparent 70%)",
                  }}
                />
                {/* Photo with hover zoom */}
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={f.photo}
                    alt={f.name}
                    fill
                    className={`object-cover ${f.photoPosition}`}
                    sizes="(max-width:640px) 100vw, 33vw"
                    priority={i === 1}
                  />
                </motion.div>
                {/* Bottom fade into dark content */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, #0a1628 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Content */}
              <div
                className="flex-1 flex flex-col items-center text-center px-6 pt-5 pb-7"
                style={{ background: CARD_CONTENT_BG }}
              >
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent mb-4" />
                <h3 className="text-base font-bold text-white mb-1 leading-tight">
                  {f.name}
                </h3>
                <p className="text-[10px] font-semibold text-[#93c5fd] uppercase tracking-[0.18em] mb-4">
                  {f.role}
                </p>
                <p className="text-sm text-[#8ea5c8] leading-relaxed text-left">
                  {f.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
