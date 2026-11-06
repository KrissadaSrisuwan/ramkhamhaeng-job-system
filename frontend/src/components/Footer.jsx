import { FaBriefcase, FaFacebook, FaInstagram, FaLine, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative bg-dark text-white overflow-hidden border-t border-white/10">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-[-50%] left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-50%] right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center">
          {/* Brand Section */}
          <div className="md:border-r md:border-white/10 md:pr-16">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-dark font-bold text-xl shadow-lg shadow-primary/30">
                <FaBriefcase size={20} />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  PartTime Match
                </p>
                <p className="text-xs tracking-wider uppercase text-white font-semibold mt-0.5">
                  Ramkhamhaeng University
                </p>
              </div>
            </div>

            <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-white" />

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
              ระบบจัดหางานพาร์ตไทม์สำหรับนักศึกษา
              <br />
              <span className="text-white/95 font-medium">
                มหาวิทยาลัยรามคำแหง
              </span>{" "}
              ศูนย์กลางเชื่อมต่อโอกาสในการทำงานและรายได้ระหว่างเรียน
            </p>
          </div>

          {/* Contact Section */}
          <div className="md:pl-16">
            <p className="text-lg font-semibold tracking-wide text-white">
              ติดต่อเรา
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/60">
              สามารถติดตามข่าวสารและติดต่อสอบถามผ่านช่องทางต่าง ๆ
              ของเราได้ตลอดเวลา
            </p>

            {/* Social Icons with Brand Hover Effects */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/30"
              >
                <FaFacebook
                  size={20}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-tr hover:from-[#fdf497] hover:via-[#fd5949] hover:to-[#d6249f] hover:border-transparent hover:shadow-lg hover:shadow-pink-500/30"
              >
                <FaInstagram
                  size={20}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
              </a>

              <a
                href="#"
                aria-label="LINE"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#06C755] hover:border-[#06C755] hover:shadow-lg hover:shadow-[#06C755]/30"
              >
                <FaLine
                  size={20}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
              </a>

              <a
                href="mailto:parttime@ramkhamhaeng.ac.th"
                aria-label="Email"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30"
              >
                <FaEnvelope
                  size={20}
                  className="text-white/80 transition-colors group-hover:text-white"
                />
              </a>
            </div>

            {/* Email Direct Link */}
            <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <FaEnvelope className="shrink-0 text-white" size={15} />

              <a
                href="mailto:parttime@ramkhamhaeng.ac.th"
                className="transition-colors hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white"
              >
                parttime@ramkhamhaeng.ac.th
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative border-t border-white/10 bg-deep-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/50 md:flex-row">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-semibold text-white/80">PartTime Match</span>.
            All rights reserved.
          </p>

          <p className="text-center md:text-right">
            ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
