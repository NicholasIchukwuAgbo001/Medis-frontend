import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// FIX: Import 'Variants' type from framer-motion to resolve type inference issue.
import { motion, Variants } from 'framer-motion';
import CountUp from 'react-countup';
import { LogoIcon, BlockchainIcon, UserShieldIcon, HeartbeatIcon, RecordIcon, TwitterIcon, GithubIcon, LinkedInIcon } from '../components/icons/IconComponents';
import LogoCloud from '../components/LogoCloud';
import ThemeToggle from '../components/ThemeToggle';

interface LandingPageProps {
  onLoginClick: () => void;
}

// A component to display a single stat
const Stat = ({ end, label, decimals = 0, prefix = '', suffix = '' }: { end: number; label: string; decimals?: number; prefix?: string; suffix?: string; }) => {
    return (
        <div>
            <h3 className="text-3xl font-bold font-heading text-white sm:text-4xl">
                {prefix}
                <CountUp end={end} duration={2.5} decimals={decimals} enableScrollSpy scrollSpyDelay={200} />
                {suffix}
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-300 dark:text-medis-gray">{label}</p>
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
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

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: '#007CF0',
            size: 0.06,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });
        const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particleSystem);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: '#EA00D9',
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
        });
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(particleCount * particleCount * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 10;
        
        const mouse = new THREE.Vector2();
        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            
            const posAttribute = particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
            const linePosAttribute = lines.geometry.getAttribute('position') as THREE.BufferAttribute;
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
                        linePosAttribute.setXYZ(lineVertexIndex++, posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
                        linePosAttribute.setXYZ(lineVertexIndex++, posAttribute.getX(j), posAttribute.getY(j), posAttribute.getZ(j));
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
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
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
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

  return (
    <div className="bg-medis-light-bg dark:bg-medis-secondary-dark text-medis-light-text dark:text-medis-dark">
      {/* Header */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-medis-secondary/80 backdrop-blur-lg border-b border-medis-light-border dark:border-medis-light-gray/20' : 'bg-transparent'}`}>
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <LogoIcon className="h-8 w-auto text-medis-primary" />
              <span className={`ml-2 text-2xl font-bold font-heading ${scrolled ? 'text-medis-light-text dark:text-white' : 'text-white'}`}>Medis</span>
            </a>
          </div>
          <div className="flex items-center lg:flex-1 lg:justify-end gap-x-4">
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
                        Secure, transparent, and patient-controlled medical records powered by blockchain technology. Your health history, finally in your hands.
                    </motion.p>
                    <motion.div
                        variants={heroItemVariants}
                        className="mt-10 flex items-center justify-center gap-x-6"
                    >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 15px rgba(0, 124, 240, 0.5)" }}
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
                    
                    <motion.div variants={heroItemVariants} className="mt-16 border-t border-white/10 pt-10">
                        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-x-8 text-center">
                            <Stat end={1.2} decimals={1} suffix="M+" label="Records Secured" />
                            <Stat end={4} suffix="k+" label="Trusted Providers" />
                            <Stat end={100} suffix="%" label="Patient Owned Data" />
                            <Stat end={99.9} decimals={1} suffix="%" label="Guaranteed Uptime" />
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 text-left">
                            <motion.div
                              whileHover={{ y: -5, scale: 1.03 }}
                              className="flex flex-col items-start"
                            >
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <BlockchainIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-4 font-semibold text-white">Immutable Security</h3>
                                <p className="mt-1 leading-7 text-gray-400">Records are cryptographically sealed, making them tamper-proof.</p>
                            </motion.div>
                            <motion.div
                              whileHover={{ y: -5, scale: 1.03 }}
                              className="flex flex-col items-start"
                            >
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <UserShieldIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-4 font-semibold text-white">Total Data Ownership</h3>
                                <p className="mt-1 leading-7 text-gray-400">You control who sees your data with explicit, verifiable permissions.</p>
                            </motion.div>
                            <motion.div
                              whileHover={{ y: -5, scale: 1.03 }}
                              className="flex flex-col items-start"
                            >
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <HeartbeatIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-4 font-semibold text-white">Instant Emergency Access</h3>
                                <p className="mt-1 leading-7 text-gray-400">Critical info is available to responders via your secure Emergency ID.</p>
                            </motion.div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-medis-secondary-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-medis-primary font-heading">Your Data, Your Control</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-medis-light-text dark:text-medis-dark sm:text-4xl font-heading">
              Everything you need for a secure medical history
            </p>
            <p className="mt-6 text-lg leading-8 text-medis-light-muted dark:text-medis-gray">
              Medis leverages cutting-edge technology to ensure your sensitive health information is always safe, accessible, and completely under your control.
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
                    <dt className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                            <BlockchainIcon className="h-6 w-6 text-white"/>
                        </div>
                        Blockchain Security
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">Every record is cryptographically secured on an immutable ledger, preventing unauthorized access and tampering.</dd>
                </motion.div>
                 <motion.div
                    className="relative pl-16"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <dt className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                            <UserShieldIcon className="h-6 w-6 text-white"/>
                        </div>
                        Patient-Centric Control
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">You grant and revoke access to your records. No one sees your data without your explicit, verifiable permission.</dd>
                </motion.div>
                 <motion.div
                    className="relative pl-16"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <dt className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                             <RecordIcon className="h-6 w-6 text-white"/>
                        </div>
                        Unified Health Record
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">Access your complete medical history from any provider in one place, anytime. No more chasing down records.</dd>
                </motion.div>
                <motion.div
                    className="relative pl-16"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <dt className="text-base font-semibold leading-7 text-medis-light-text dark:text-medis-dark">
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-medis-primary">
                            <HeartbeatIcon className="h-6 w-6 text-white"/>
                        </div>
                        Emergency Ready
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-medis-light-muted dark:text-medis-gray">Your critical information (blood type, allergies) is available instantly via your Emergency NFT for first responders.</dd>
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partners" className="bg-white dark:bg-medis-secondary-dark py-24 sm:py-32">
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
                    We collaborate with pioneers in healthcare and technology to build a truly decentralized and interoperable health data network.
                </p>
            </motion.div>
            <LogoCloud />
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-medis-secondary">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
            <div className="text-center">
                <a href="#" className="-m-1.5 p-1.5 flex items-center justify-center">
                    <LogoIcon className="h-8 w-auto text-medis-primary" />
                    <span className="ml-2 text-2xl font-bold font-heading text-medis-light-text dark:text-white">Medis</span>
                </a>
                <p className="mt-4 text-sm leading-6 text-medis-light-muted dark:text-medis-gray">
                    Securing the future of health records, one block at a time.
                </p>
            </div>
            <nav className="mt-10 mb-10 flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
                <a href="#" className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">About</a>
                <a href="#features" className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">Features</a>
                <a href="#" className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">Careers</a>
                <a href="#" className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">Contact</a>
                <a href="#" className="text-sm leading-6 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">Privacy Policy</a>
            </nav>
             <div className="mt-10 pt-8 border-t border-medis-light-border dark:border-medis-light-gray/20 flex flex-col-reverse items-center gap-y-6 sm:flex-row sm:justify-between">
                <p className="text-xs leading-5 text-medis-light-muted dark:text-medis-gray">
                    &copy; {new Date().getFullYear()} Medis, Inc. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6">
                    <motion.a whileHover={{ scale: 1.2, y: -2 }} href="#" className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">
                        <span className="sr-only">Twitter</span>
                        <TwitterIcon className="h-6 w-6" />
                    </motion.a>
                    <motion.a whileHover={{ scale: 1.2, y: -2 }} href="#" className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">
                        <span className="sr-only">GitHub</span>
                        <GithubIcon className="h-6 w-6" />
                    </motion.a>
                    <motion.a whileHover={{ scale: 1.2, y: -2 }} href="#" className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white transition-colors">
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
