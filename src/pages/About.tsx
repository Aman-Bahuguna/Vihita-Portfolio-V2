import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Asterisk, Minus, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { designer } from '../data/designer';
import { PerspectiveStudy } from '../features/about/PerspectiveStudy';
import { AppLink, Button, Container, ExternalLink, Eyebrow, Heading, Text } from '../components/ui/Primitives';
import { usePageAnimations } from '../hooks/usePageAnimations';
import { useMotionSettings } from '../hooks/useMotionSettings';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from '../features/about/Designer.module.css';

gsap.registerPlugin(ScrollTrigger);

const approach = [
  { title: 'Look closer.', note: 'OBSERVE', copy: 'Every space begins with people. How they move, what they need, and what makes them feel at home.' },
  { title: 'Find the feeling.', note: 'EXPLORE', copy: 'Materials, light, and a clear concept. Bringing the pieces together until a space has a language of its own.' },
  { title: 'Make it matter.', note: 'CREATE', copy: 'From a first sketch to a detailed drawing, turning intention into spaces that work as beautifully as they feel.' },
];

export default function About() {
  const root = useRef<HTMLDivElement>(null);
  const [experience, setExperience] = useState<number | null>(0);
  const { reducedMotion } = useMotionSettings();
  usePageAnimations(root);
  usePageTitle('The designer');

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.from('[data-designer-line]', { yPercent: 110, stagger: 0.12, duration: 1.15, ease: 'power4.out' });
      gsap.from('[data-portrait-frame]', { y: 55, rotation: 5, opacity: 0, duration: 1.3, ease: 'power3.out', delay: 0.2 });
      gsap.to('[data-orbit]', { rotation: 180, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 } });
      gsap.fromTo('[data-designer-ticker]', { xPercent: 3 }, { xPercent: -18, ease: 'none', scrollTrigger: { trigger: '[data-designer-ticker]', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('[data-belief-word]', { opacity: 0.45 }, { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: '[data-belief]', start: 'top 90%', end: 'bottom 75%', scrub: 0.6 } });
      const media = gsap.matchMedia();
      media.add('(min-width: 801px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-approach-card]').forEach((card, index, cards) => {
          if (index === cards.length - 1) return;
          gsap.to(card, { scale: 0.94, y: -12, ease: 'none', scrollTrigger: { trigger: cards[index + 1], start: 'top 78%', end: 'top 30%', scrub: true } });
        });
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return <div ref={root} className={styles.page}>
    <section id="entrance" className={styles.hero}>
      <Container>
        <div className={styles.heroTop}><Eyebrow>THE MIND BEHIND THE SPACES</Eyebrow><Text>Jaipur, India <span className={styles.liveDot} /></Text></div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <Heading as="h1" className={styles.name}><span><span data-designer-line>VIHITA</span></span><span><span data-designer-line>KHURANA<span className={styles.accent}>.</span></span></span></Heading>
            <div className={styles.heroIntro}><Asterisk className={styles.star} data-orbit strokeWidth={1} /><div><Heading as="h2">A designer.<br />A curious human.</Heading><Text>I shape spaces around the way we live.<br />With intention, a little intuition, and a lot of soul.</Text></div></div>
            <ExternalLink href={designer.resume} target="_blank" rel="noreferrer" className={styles.resume}>Explore my résumé <ArrowUpRight size={19} /></ExternalLink>
          </div>
          <div className={styles.portrait} data-portrait-frame>
            <div className={styles.portraitImage}><img src={designer.portrait} alt="Vihita Khurana seated beside light-filled white curtains" width="976" height="1179" fetchPriority="high" data-parallax /></div>
            <div className={styles.portraitLabel}><Text>NOT JUST SPACES.<br />A POINT OF VIEW.</Text><ArrowUpRight strokeWidth={1} /></div>
            <Text className={styles.photoNote}>Interior architectural designer / Vihita Khurana</Text>
          </div>
        </div>
        <div className={styles.heroBottom}><Text>Observe. Imagine. Make.</Text><ExternalLink href="#perspective">A little more about me <ArrowDown size={16} /></ExternalLink><Text>SCROLL TO DISCOVER</Text></div>
      </Container>
    </section>

    <div className={styles.ticker} aria-hidden="true"><div data-designer-ticker>SPACES WITH SOUL <Asterisk /> DESIGN WITH INTENT <Asterisk /> SPACES WITH SOUL <Asterisk /> DESIGN WITH INTENT <Asterisk /></div></div>

    <section id="perspective" className={styles.perspective}>
      <Container>
        <div className={styles.sectionTop}><Eyebrow>01 / A PERSONAL PERSPECTIVE</Eyebrow><span>A little less ordinary.</span></div>
        <div className={styles.perspectiveGrid}>
          <div>
            <Heading className={styles.belief} data-belief>{'Good spaces don’t just look a certain way. They make you feel a certain way.'.split(' ').map((word, index) => <span key={index} data-belief-word>{word} </span>)}</Heading>
            <Text className={styles.bodyCopy}>{designer.bio}</Text>
            <div className={styles.tags}>{['Material-minded', 'People-first', 'Always curious'].map((tag) => <Text as="span" key={tag}>{tag}</Text>)}</div>
          </div>
          <PerspectiveStudy />
        </div>
      </Container>
    </section>

    <section className={styles.approach}>
      <Container>
        <div className={styles.sectionTop}><Eyebrow>02 / THE WAY I SEE IT</Eyebrow><span>Thought before form.</span></div>
        <div className={styles.approachGrid}>
          <div className={styles.approachIntro} data-reveal><Heading>Not a formula.<br />A way of<br /><span className={styles.accent}>thinking.</span></Heading><Text>Thoughtful spaces don’t happen by accident. Here’s where I begin.</Text><ArrowDown size={36} strokeWidth={1} /></div>
          <div className={styles.approachCards}>{approach.map((item, index) => <article className={styles.approachCard} data-approach-card key={item.note}><div><Eyebrow>{item.note}</Eyebrow><span className={styles.cardNumber}>0{index + 1}</span></div><Heading as="h3">{item.title}</Heading><Text>{item.copy}</Text><svg viewBox="0 0 180 110" fill="none" aria-hidden="true"><path data-draw d={index === 0 ? 'M20 90V20h140v70H20Zm45-70v30H20m45 0h45v40m0-40h50M65 50a30 30 0 0 1 30 30' : index === 1 ? 'M35 85V40L90 10l55 30v45L90 105 35 85Zm0-45 55 25 55-25M90 65v40M60 26l58 28M62 97V53' : 'M20 90h140M35 90V35h110v55M55 90V55h40v35M115 48h15v20h-15M20 35l70-25 70 25'} stroke="currentColor" strokeWidth="1.4" /></svg></article>)}</div>
        </div>
      </Container>
    </section>

    <section className={styles.journey}>
      <Container>
        <div className={styles.sectionTop}><Eyebrow>03 / ALWAYS A WORK IN PROGRESS</Eyebrow><span>Learning by doing.</span></div>
        <div className={styles.journeyTitle} data-reveal><Heading>A growing<br />point of view<span className={styles.accent}>.</span></Heading><Text>Different studios. Different perspectives.<br />The same curiosity, every time.</Text></div>
        <div className={styles.journeyGrid}>
          <div className={styles.education} data-reveal><Eyebrow>THE FOUNDATION / {designer.education.dates}</Eyebrow><Heading as="h3">{designer.education.institution}</Heading><Text>{designer.education.program}</Text><div className={styles.educationFoot}><Text>{designer.languages.join(' / ')}</Text><ArrowUpRight size={24} /></div></div>
          <div className={styles.experienceList}>{designer.experience.map((item, index) => <div key={item.studio} className={styles.experienceItem}><Button variant="quiet" aria-expanded={experience === index} aria-controls={`experience-${index}`} onClick={() => setExperience(experience === index ? null : index)}><span className={styles.experienceIndex}>0{index + 1}</span><span className={styles.experienceName}>{item.studio}<Text as="span">{item.location}</Text></span>{experience === index ? <Minus /> : <Plus />}</Button><div id={`experience-${index}`} hidden={experience !== index}><Text className={styles.experienceDetail}>{item.description}</Text></div></div>)}</div>
        </div>
      </Container>
    </section>

    <section className={styles.toolkit}>
      <Container>
        <div className={styles.sectionTop}><Eyebrow>04 / FROM AN IDEA TO SOMETHING REAL</Eyebrow><span>The tools behind the thinking.</span></div>
        <div className={styles.toolkitIntro} data-reveal><Heading>Many tools.<br />One intention.</Heading><Text>From a quick sketch to an immersive visualization.<br />The medium changes. The care doesn’t.</Text></div>
        <div className={styles.softwareGrid}>{designer.software.map((software, index) => <div key={software} data-reveal><Text as="span">0{index + 1}</Text><Heading as="h3">{software}</Heading><ArrowUpRight size={21} /></div>)}</div>
      </Container>
    </section>

    <section className={styles.cta}>
      <Container><Eyebrow>THE NEXT CHAPTER COULD BE OURS.</Eyebrow><AppLink to="/#contact" className={styles.ctaLink} data-magnetic><Heading>Let’s make<br />space for ideas.</Heading><span><ArrowUpRight strokeWidth={1} /></span></AppLink><div className={styles.ctaBottom}><Text>Good things start with a conversation.</Text><AppLink to="/projects">Or, explore my work <ArrowUpRight size={17} /></AppLink></div></Container>
    </section>
  </div>;
}
