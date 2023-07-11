import { ILevelData } from "../../../common-types/index";

export type IViewData = ILevelData
  & {
    callbacks: IViewCallbacks,
    mappedLevels: ('self' | 'hint' | '')[]
  };

export type IViewCallbacks = {
  changeLevelCallback: (levelId: number) => void,
  resetProgressCallback: () => ('self' | 'hint' | '')[]
}