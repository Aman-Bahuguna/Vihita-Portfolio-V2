import styles from './RoomStudy.module.css';

export function RoomPoster() {
  return <div className={styles.poster}>
    <img src="/models/tiny-room/poster.webp" alt="Textured isometric bedroom with warm wood furnishings and a sunlit window" width={756} height={828} decoding="async" fetchPriority="high" />
  </div>;
}
