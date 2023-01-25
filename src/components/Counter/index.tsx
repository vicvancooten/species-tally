import { CounterType } from "../../Types";
import styles from "./styles.module.scss";

const Counter: React.FC<{
  counter: CounterType;
  onUpdateCounter: (c: CounterType) => void;
}> = ({ counter, onUpdateCounter }) => {
  return (
    <div
      className={styles.counter}
      onClick={() => onUpdateCounter({ ...counter, count: counter.count + 1 })}
    >
      <div className={styles.label}>
        <input
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={styles.input}
          value={counter.label}
          onChange={(e) => {
            onUpdateCounter({ ...counter, label: e.target.value });
          }}
        />
      </div>
      <div className={styles.count}>{counter.count}</div>
    </div>
  );
};

export default Counter;
