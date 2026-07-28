import {
  getCurrentWeighing,
  type Goal,
  type Profile,
  type Weighing,
} from "../domain";

export interface GoalGroups {
  active: Goal | null;
  pending: Goal[];
  completed: Goal[];
}

export function getGoalReferenceWeightKg(
  profile: Profile,
  weighings: readonly Weighing[],
): number {
  return getCurrentWeighing(weighings)?.weightKg ?? profile.initialWeightKg;
}

export function groupGoals(goals: readonly Goal[]): GoalGroups {
  const orderedGoals = [...goals].sort(
    (left, right) =>
      left.displayOrder - right.displayOrder ||
      left.createdAt.localeCompare(right.createdAt),
  );

  return {
    active: orderedGoals.find(({ isActive }) => isActive) ?? null,
    pending: orderedGoals.filter(
      ({ completedOn, isActive }) =>
        completedOn === null && !isActive,
    ),
    completed: orderedGoals
      .filter(({ completedOn }) => completedOn !== null)
      .sort((left, right) =>
        (right.completedOn ?? "").localeCompare(left.completedOn ?? ""),
      ),
  };
}

export function nextGoalDisplayOrder(goals: readonly Goal[]): number {
  if (goals.length === 0) {
    return 0;
  }

  return Math.max(...goals.map(({ displayOrder }) => displayOrder)) + 1;
}
