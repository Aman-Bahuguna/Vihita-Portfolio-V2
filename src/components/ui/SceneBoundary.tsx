import { Component } from 'react';
import type { ReactNode } from 'react';
import { DoorMark, Eyebrow, Text } from './Primitives';
import styles from './SceneBoundary.module.css';

export class SceneBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return this.props.fallback ?? <div className={styles.fallback}><DoorMark /><Text>A quieter perspective.</Text><Eyebrow>3D is unavailable on this device.<br />The rest of the journey is yours to explore.</Eyebrow></div>;
    return this.props.children;
  }
}
