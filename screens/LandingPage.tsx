import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// FIX: Import 'Variants' type from framer-motion to resolve type inference issue.
import { motion, Variants, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  LogoIcon,
  BlockchainIcon,
  UserShieldIcon,
  HeartbeatIcon,
  RecordIcon,
  TwitterIcon,
  GithubIcon,
  LinkedInIcon,
} from "../components/icons/IconComponents";
import LogoCloud from "../components/LogoCloud";
import ThemeToggle from "../components/ThemeToggle";

interface LandingPageProps {
  onLoginClick: () => void;
}

// A component to display a single stat
const Stat = ({
  end,
  label,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  end: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) => {
  return (
    <div>
      <h3 className="text-3xl font-bold font-heading text-white sm:text-4xl">
        {prefix}
        <CountUp
          end={end}
          duration={2.5}
          decimals={decimals}
          enableScrollSpy
          scrollSpyDelay={200}
        />
        {suffix}
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-300 dark:text-medis-gray">
        {label}
      </p>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const particleCount = 250;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: "#007CF0",
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(
      particlesGeometry,
      particleMaterial
    );
    scene.add(particleSystem);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#EA00D9",
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 10;

    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const posAttribute = particleSystem.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const linePosAttribute = lines.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      let lineVertexIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        posAttribute.setX(i, posAttribute.getX(i) + velocities[i].x);
        posAttribute.setY(i, posAttribute.getY(i) + velocities[i].y);
        posAttribute.setZ(i, posAttribute.getZ(i) + velocities[i].z);

        if (Math.abs(posAttribute.getX(i)) > 10) velocities[i].x *= -1;
        if (Math.abs(posAttribute.getY(i)) > 10) velocities[i].y *= -1;
        if (Math.abs(posAttribute.getZ(i)) > 10) velocities[i].z *= -1;

        for (let j = i + 1; j < particleCount; j++) {
          const dx = posAttribute.getX(i) - posAttribute.getX(j);
          const dy = posAttribute.getY(i) - posAttribute.getY(j);
          const dz = posAttribute.getZ(i) - posAttribute.getZ(j);
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 2.5) {
            linePosAttribute.setXYZ(
              lineVertexIndex++,
              posAttribute.getX(i),
              posAttribute.getY(i),
              posAttribute.getZ(i)
            );
            linePosAttribute.setXYZ(
              lineVertexIndex++,
              posAttribute.getX(j),
              posAttribute.getY(j),
              posAttribute.getZ(j)
            );
          }
        }
      }

      lines.geometry.setDrawRange(0, lineVertexIndex);
      linePosAttribute.needsUpdate = true;
      posAttribute.needsUpdate = true;

      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (
        currentMount &&
        renderer.domElement &&
        currentMount.contains(renderer.domElement)
      ) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // FIX: Explicitly type variants with 'Variants' to prevent type inference issues.
  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const heroItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-medis-light-bg dark:bg-medis-secondary-dark text-medis-light-text dark:text-medis-dark">
      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-medis-secondary/80 backdrop-blur-lg border-b border-medis-light-border dark:border-medis-light-gray/20"
            : "bg-transparent"
        }`}
      >
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <LogoIcon className="h-8 w-auto text-medis-primary" />
              <span
                className={`ml-2 text-2xl font-bold font-heading ${
                  scrolled
                    ? "text-medis-light-text dark:text-white"
                    : "text-white"
                }`}
              >
                Medis
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <motion.a
              href="#"
              className={`text-sm font-medium transition-all duration-300 hover:text-medis-primary relative px-1 py-2 rounded-md ${
                scrolled
                  ? "text-medis-light-text dark:text-white"
                  : "text-white"
              }`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="relative z-10">Home</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-medis-primary rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 bg-medis-primary/10 rounded-md opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
            <motion.a
              href="#features"
              className={`text-sm font-medium transition-all duration-300 hover:text-medis-primary relative px-1 py-2 rounded-md ${
                scrolled
                  ? "text-medis-light-text dark:text-white"
                  : "text-white"
              }`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="relative z-10">Features</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-medis-primary rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 bg-medis-primary/10 rounded-md opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
            <motion.a
              href="#partners"
              className={`text-sm font-medium transition-all duration-300 hover:text-medis-primary relative px-1 py-2 rounded-md ${
                scrolled
                  ? "text-medis-light-text dark:text-white"
                  : "text-white"
              }`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="relative z-10">Partners</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-medis-primary rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 bg-medis-primary/10 rounded-md opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
            <motion.a
              href="#about"
              className={`text-sm font-medium transition-all duration-300 hover:text-medis-primary relative px-1 py-2 rounded-md ${
                scrolled
                  ? "text-medis-light-text dark:text-white"
                  : "text-white"
              }`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="relative z-10">About</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-medis-primary rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 bg-medis-primary/10 rounded-md opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
            <motion.a
              href="#security"
              className={`text-sm font-medium transition-all duration-300 hover:text-medis-primary relative px-1 py-2 rounded-md ${
                scrolled
                  ? "text-medis-light-text dark:text-white"
                  : "text-white"
              }`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="relative z-10">Security</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-medis-primary rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 bg-medis-primary/10 rounded-md opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
            <motion.a
              href="#contact"
              className={`text-sm font-medium transition-all duration-300 hover:text-medis-primary relative px-1 py-2 rounded-md ${
                scrolled
                  ? "text-medis-light-text dark:text-white"
                  : "text-white"
              }`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="relative z-10">Contact</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-medis-primary rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 bg-medis-primary/10 rounded-md opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          </div>

          <div className="flex items-center lg:flex-1 lg:justify-end gap-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  scrolled
                    ? "text-medis-light-text dark:text-white hover:bg-gray-100 dark:hover:bg-medis-secondary"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </motion.button>
            </div>

            <motion.div whileHover={{ scale: 1.1 }}>
              <ThemeToggle />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
              className="rounded-md bg-medis-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-medis-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medis-primary transition-colors duration-200"
            >
              Access Portal
            </motion.button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-medis-secondary/95 backdrop-blur-lg border-t border-medis-light-border dark:border-medis-light-gray/20"
            >
              <div className="px-6 py-4 space-y-4">
                <motion.a
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-medis-light-text dark:text-white hover:text-medis-primary transition-all duration-300 relative px-3 py-2 rounded-lg"
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(0, 124, 240, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="relative z-10">Home</span>
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-medis-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
                <motion.a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-medis-light-text dark:text-white hover:text-medis-primary transition-all duration-300 relative px-3 py-2 rounded-lg"
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(0, 124, 240, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="relative z-10">Features</span>
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-medis-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
                <motion.a
                  href="#partners"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-medis-light-text dark:text-white hover:text-medis-primary transition-all duration-300 relative px-3 py-2 rounded-lg"
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(0, 124, 240, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="relative z-10">Partners</span>
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-medis-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
                <motion.a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-medis-light-text dark:text-white hover:text-medis-primary transition-all duration-300 relative px-3 py-2 rounded-lg"
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(0, 124, 240, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="relative z-10">About</span>
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-medis-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
                <motion.a
                  href="#security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-medis-light-text dark:text-white hover:text-medis-primary transition-all duration-300 relative px-3 py-2 rounded-lg"
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(0, 124, 240, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="relative z-10">Security</span>
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-medis-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
                <motion.a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-medis-light-text dark:text-white hover:text-medis-primary transition-all duration-300 relative px-3 py-2 rounded-lg"
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(0, 124, 240, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="relative z-10">Contact</span>
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-medis-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative isolate overflow-hidden bg-medis-secondary-dark h-screen">
          <div ref={mountRef} className="absolute inset-0 z-0 opacity-70" />
          <div className="relative mx-auto max-w-7xl px-6 py-32 z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={heroItemVariants}
                className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-heading"
              >
                The Future of Health Records is Here.
              </motion.h1>
              <motion.p
                variants={heroItemVariants}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                Secure, transparent, and patient-controlled medical records
                powered by blockchain technology. Your health history, finally
                in your hands.
              </motion.p>
              <motion.div
                variants={heroItemVariants}
                className="mt-10 flex items-center justify-center gap-x-6"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 0 15px rgba(0, 124, 240, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLoginClick}
                  className="rounded-md bg-medis-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medis-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medis-primary transition-colors duration-200"
                >
                  Access Your Portal
                </motion.button>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#features"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </motion.a>
              </motion.div>

              <motion.div
                variants={heroItemVariants}
                className="mt-16 border-t border-white/10 pt-10"
              >
                <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-x-8 text-center">
                  <Stat
                    end={1.2}
                    decimals={1}
                    suffix="M+"
                    label="Records Secured"
                  />
                  <Stat end={4} suffix="k+" label="Trusted Providers" />
                  <Stat end={100} suffix="%" label="Patient Owned Data" />
                  <Stat
                    end={99.9}
                    decimals={1}
                    suffix="%"
                    label="Guaranteed Uptime"
                  />
                </div>

                <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 text-left">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="flex flex-col items-start"
                  >
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <BlockchainIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">
                      Immutable Security
                    </h3>
                    <p className="mt-1 leading-7 text-gray-400">
                      Records are cryptographically sealed, making them
                      tamper-proof.
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="flex flex-col items-start"
                  >
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <UserShieldIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">
                      Total Data Ownership
                    </h3>
                    <p className="mt-1 leading-7 text-gray-400">
                      You control who sees your data with explicit, verifiable
                      permissions.
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="flex flex-col items-start"
                  >
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <HeartbeatIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">
                      Instant Emergency Access
                    </h3>
                    <p className="mt-1 leading-7 text-gray-400">
                      Critical info is available to responders via your secure
                      Emergency ID.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white dark:bg-medis-secondary-dark py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-medis-primary font-heading">
              Your Data, Your Control
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-medis-light-text dark:text-medis-dark sm:text-4xl font-heading">
              Everything you need for a secure medical history
            </p>
            <p className="mt-6 text-lg leading-8 text-medis-light-muted dark:text-medis-gray">
              Medis leverages cutting-edge technology to ensure your sensitive
              health information is always safe, accessible, and completely
              under your control.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <motion.div
                className="relative pl-16"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                    <BlockchainIcon className="h-6 w-6 text-white" />
                  </div>
                  Blockchain Security
                </div>
                <div className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">
                  Every record is cryptographically secured on an immutable
                  ledger, preventing unauthorized access and tampering.
                </div>
              </motion.div>
              <motion.div
                className="relative pl-16"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                    <UserShieldIcon className="h-6 w-6 text-white" />
                  </div>
                  Patient-Centric Control
                </div>
                <div className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">
                  You grant and revoke access to your records. No one sees your
                  data without your explicit, verifiable permission.
                </div>
              </motion.div>
              <motion.div
                className="relative pl-16"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                    <RecordIcon className="h-6 w-6 text-white" />
                  </div>
                  Unified Health Record
                </div>
                <div className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">
                  Access your complete medical history from any provider in one
                  place, anytime. No more chasing down records.
                </div>
              </motion.div>
              <motion.div
                className="relative pl-16"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                    <HeartbeatIcon className="h-6 w-6 text-white" />
                  </div>
                  Emergency Ready
                </div>
                <div className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">
                  Your critical information (blood type, allergies) is available
                  instantly via your Emergency NFT for first responders.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section
        id="partners"
        className="bg-white dark:bg-medis-secondary-dark py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-medis-light-text dark:text-medis-dark sm:text-4xl font-heading">
              Our Growing Partnership Ecosystem
            </h2>
            <p className="mt-6 text-lg leading-8 text-medis-light-muted dark:text-medis-gray">
              We collaborate with pioneers in healthcare and technology to build
              a truly decentralized and interoperable health data network.
            </p>
          </motion.div>
          <LogoCloud />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-gray-50 dark:bg-medis-secondary py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-base font-semibold leading-7 text-medis-primary font-heading">
              About Medis
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-medis-light-text dark:text-medis-dark sm:text-4xl font-heading">
              Revolutionizing Healthcare Through Blockchain
            </p>
            <p className="mt-6 text-lg leading-8 text-medis-light-muted dark:text-medis-gray">
              Founded by healthcare professionals and blockchain experts, Medis
              is on a mission to give patients complete control over their
              medical data while ensuring the highest levels of security and
              privacy.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <motion.div
                className="relative pl-16"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                    <UserShieldIcon className="h-6 w-6 text-white" />
                  </div>
                  Patient-First Approach
                </div>
                <div className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">
                  Every decision we make prioritizes patient autonomy and data
                  ownership, ensuring you remain in complete control of your
                  health information.
                </div>
              </motion.div>

              <motion.div
                className="relative pl-16"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                    <BlockchainIcon className="h-6 w-6 text-white" />
                  </div>
                  Innovation & Trust
                </div>
                <div className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">
                  We combine cutting-edge blockchain technology with healthcare
                  expertise to create solutions that are both innovative and
                  trustworthy.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section
        id="security"
        className="bg-gradient-to-br from-medis-secondary-dark to-gray-900 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-base font-semibold leading-7 text-medis-primary font-heading">
              🔒 Military-Grade Security
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading">
              Your Data is Protected by Advanced Cryptography
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We employ state-of-the-art security measures to ensure your
              medical records remain private, secure, and tamper-proof at all
              times.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medis-primary/10 border border-medis-primary/20">
                  <BlockchainIcon className="h-8 w-8 text-medis-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  256-bit Encryption
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Industry-standard encryption protects data at rest and in
                  transit
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medis-primary/10 border border-medis-primary/20">
                  <UserShieldIcon className="h-8 w-8 text-medis-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Zero-Knowledge Proofs
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Verify data integrity without exposing sensitive information
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-medis-primary/10 border border-medis-primary/20">
                  <HeartbeatIcon className="h-8 w-8 text-medis-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Multi-Signature Auth
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Multiple authorization layers prevent unauthorized access
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-white dark:bg-medis-secondary-dark py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-base font-semibold leading-7 text-medis-primary font-heading">
              Get in Touch
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-medis-light-text dark:text-medis-dark sm:text-4xl font-heading">
              Ready to Transform Your Healthcare Experience?
            </p>
            <p className="mt-6 text-lg leading-8 text-medis-light-muted dark:text-medis-gray">
              Join thousands of patients and healthcare providers who trust
              Medis with their medical data. Get started today or reach out to
              learn more.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <motion.div
                className="flex flex-col items-center text-center p-8 bg-medis-light-bg dark:bg-medis-secondary rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="rounded-full bg-medis-primary/10 p-4 border border-medis-primary/20">
                  <svg
                    className="h-8 w-8 text-medis-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-medis-light-text dark:text-medis-dark">
                  Email Us
                </h3>
                <p className="mt-2 text-medis-light-muted dark:text-medis-gray">
                  Get in touch with our team
                </p>
                <a
                  href="mailto:contact@medis.health"
                  className="mt-4 text-medis-primary hover:text-medis-primary-dark font-medium transition-colors"
                >
                  contact@medis.health
                </a>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center p-8 bg-medis-light-bg dark:bg-medis-secondary rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="rounded-full bg-medis-primary/10 p-4 border border-medis-primary/20">
                  <svg
                    className="h-8 w-8 text-medis-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-medis-light-text dark:text-medis-dark">
                  Live Support
                </h3>
                <p className="mt-2 text-medis-light-muted dark:text-medis-gray">
                  Chat with our support team
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-medis-primary text-white rounded-lg hover:bg-medis-primary-dark transition-colors font-medium"
                >
                  Start Chat
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-medis-secondary">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
          <div className="text-center">
            <a
              href="#"
              className="-m-1.5 p-1.5 flex items-center justify-center"
            >
              <LogoIcon className="h-8 w-auto text-medis-primary" />
              <span className="ml-2 text-2xl font-bold font-heading text-medis-light-text dark:text-white">
                Medis
              </span>
            </a>
            <p className="mt-4 text-sm leading-6 text-medis-light-muted dark:text-medis-gray">
              Securing the future of health records, one block at a time.
            </p>
          </div>
          <nav
            className="mt-10 mb-10 flex flex-wrap justify-center gap-x-6 gap-y-2"
            aria-label="Footer"
          >
            <a
              href="#"
              className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
            >
              Careers
            </a>
            <a
              href="#"
              className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </nav>
          <div className="mt-10 pt-8 border-t border-medis-light-border dark:border-medis-light-gray/20 flex flex-col-reverse items-center gap-y-6 sm:flex-row sm:justify-between">
            <p className="text-xs leading-5 text-medis-light-muted dark:text-medis-gray">
              &copy; {new Date().getFullYear()} Medis, Inc. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href="#"
                className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href="#"
                className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <GithubIcon className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href="#"
                className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <LinkedInIcon className="h-6 w-6" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
