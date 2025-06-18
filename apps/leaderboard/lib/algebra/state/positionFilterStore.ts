import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import deepMerge from "lodash.merge";
import { PositionsStatus } from "@/types/algebra/types/position-filter-status";

type FilteredPositions = {
  [key in PositionsStatus]: boolean;
};

interface FilterStore {
  filterStatus: FilteredPositions;
  actions: {
    setFilterStatus: (positionStatus: PositionsStatus) => void;
    reset: () => void;
  };
}

export const usePositionFilterStore = create(
  persist<FilterStore>(
    (set) => ({
      filterStatus: {
        [PositionsStatus.OPEN]: true,
        [PositionsStatus.ON_FARMING]: true,
        [PositionsStatus.CLOSED]: false,
      },
      actions: {
        setFilterStatus: (positionStatus: PositionsStatus) => {
          set((state) => ({
            filterStatus: {
              ...state.filterStatus,
              [positionStatus]: !state.filterStatus[positionStatus],
            },
          }));
        },
        reset: () =>
          set({
            filterStatus: {
              [PositionsStatus.OPEN]: true,
              [PositionsStatus.ON_FARMING]: true,
              [PositionsStatus.CLOSED]: false,
            },
          }),
      },
    }),
    {
      name: "position-filter-storage",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) =>
        deepMerge(currentState, persistedState),
    }
  )
);
