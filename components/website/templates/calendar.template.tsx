import {Container} from '@/components/ui/Layout';

import {
  Calendar,
  CalendarItem,
  CalendarList,
} from '@/components/features/website/Calendar';

import {IntroImage} from '@/components/website/intro';
import {bigMarkerService} from '@/services';
import {Culture, UmbracoProperties} from '@/types';

const CalendarTemplate = async ({
  properties,
  locale,
}: {
  properties: UmbracoProperties;
  locale: keyof typeof Culture;
}) => {
  let conferences: any[];
  try {
    const bigmarker = await bigMarkerService.getConferences();
    conferences = bigmarker.conferences;
  } catch (err) {
    console.error('Error in CalendarTemplate:', err);
  }

  return (
    <>
      <IntroImage properties={properties} />

      <Container className="relative left-1/2 right-1/2 -mx-[50vw] mt-16 py-12 w-screen bg-ps-lightblue-400 my-14">
        <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Container className="grid grid-cols-1 gap-3 lg:grid-cols-2 md:gap-6 -mt-24">
            {conferences &&
              conferences.map(conference => (
                <CalendarItem
                  key={conference.id}
                  conference={conference}
                  locale={locale}
                />
              ))}
          </Container>
          <Container className="grid grid-cols-1 gap-3 lg:grid-cols-2 md:gap-6 p-10 mt-6 bg-slate-100">
            <Container className="flex flex-col flex-grow calendar">
              <Calendar locale={locale} />
            </Container>

            <Container className="flex flex-col flex-grow">
              <CalendarList locale={locale} />
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default CalendarTemplate;
