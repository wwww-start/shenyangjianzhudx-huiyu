"""PID teaching simulation. Synthetic plant, not measured motor data."""
import csv
import math
from pathlib import Path


def simulate():
    integral = derivative = previous = speed = 0.0
    dt = 0.01
    rows = []
    for k in range(800):
        target = 60.0 if k >= 50 else 0.0
        error = target - speed
        raw_d = -0.001 * (speed - previous) / dt if k else 0.0
        derivative += dt / (0.03 + dt) * (raw_d - derivative)
        next_i = max(-0.8, min(0.8, integral + 0.04 * error * dt))
        trial = 0.025 * error + next_i + derivative
        blocked = (trial > 1.0 and error > 0) or (trial < 0 and error < 0)
        if not blocked:
            integral = next_i
        output = max(0.0, min(1.0, 0.025 * error + integral + derivative))
        rows.append((k * dt, target, speed, output))
        previous = speed
        gain = 90.0 if k >= 400 else 100.0
        speed += dt * (gain * output - speed) / 0.25
    return rows


def main():
    rows = simulate()
    destination = Path("pid_trace.csv")
    with destination.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.writer(stream)
        writer.writerow(("time", "target", "speed", "output"))
        writer.writerows(rows)
    assert all(math.isfinite(value) for row in rows for value in row)
    assert all(0.0 <= row[3] <= 1.0 for row in rows)
    assert abs(rows[-1][2] - 60.0) < 1.0
    print(f"final_speed={rows[-1][2]:.3f}")
    print(f"max_speed={max(row[2] for row in rows):.3f}")
    print(f"csv={destination.resolve()}")


if __name__ == "__main__":
    main()
