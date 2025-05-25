import { Stack } from 'app/components2/atoms/stack';
import { AtYourGlance } from 'app/components2/organisms/home/at-your-glance';
import { Greeting } from 'app/components2/organisms/home/greeting';
import { NewsAndFeedsShowcase } from 'app/components2/organisms/home/news-and-feeds/component';
import { PhotoListingCards } from 'app/components2/organisms/home/photo-history-listings/component';
import { PopularLocatinsShowCase } from 'app/components2/organisms/home/popular-locations/component';
import { PremiumListingsShowCase } from 'app/components2/organisms/home/premium-listings-showcase/component';
import { QuickLinks } from 'app/components2/organisms/home/quick-links';
import { TopRatedAgentsShowCase } from 'app/components2/organisms/home/top-rated-agents/component';

export const HomeScreenTemplate = (props: HomeScreenTemplateProps) => {
  return (
    <Stack className="py-4">
      <Greeting />
      <PhotoListingCards />
      <AtYourGlance />
      <PremiumListingsShowCase />
      <PopularLocatinsShowCase />
      <TopRatedAgentsShowCase />
      <NewsAndFeedsShowcase />
      <QuickLinks />
    </Stack>
  );
};

export type HomeScreenTemplateProps = {};
