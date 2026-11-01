import { House } from 'lucide-react';
import { Text } from '../ui/Primitives';
import styles from './RoomLoader.module.css';

export function RoomLoader() {
  return (
    <div className={styles.loader} data-page-loading role="status">
      <Text className="sr-only">Loading page</Text>
      <div className={styles.houses} aria-hidden="true">
        <House className={styles.house} strokeWidth={1.5} />
        <House className={styles.house} strokeWidth={1.5} />
        <House className={styles.house} strokeWidth={1.5} />
      </div>
    </div>
  );
}
