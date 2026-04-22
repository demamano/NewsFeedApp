import { NavigatorScreenParams } from '@react-navigation/native';
import { Story } from '../api/types';

export type StoriesStackParamList = {
  StoryList: undefined;
  StoryDetail: { story: Story };
};

export type RootTabParamList = {
  FeedTab: NavigatorScreenParams<StoriesStackParamList>;
  BookmarksTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
