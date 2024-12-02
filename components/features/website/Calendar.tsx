'use client';

import {Container} from '@/components/ui/Layout';

import Button from '@/components/ui/Button';
import {bigMarkerService} from '@/services';
import {useConferenceStore} from '@/stores/website/conferenceStore';
import {Conference, Culture, Event} from '@/types';
import {getDateFnsLocale} from '@/utils/formats/dateTimeFormat';
import {truncateText} from '@/utils/helpers';
import nlLocale from '@fullcalendar/core/locales/nl';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {format} from 'date-fns';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

const getConferencesByDate = async (startdate: Date, enddate: Date) => {
  const data = await bigMarkerService.getConferencesByDateRange(
    startdate,
    enddate,
  );

  return data.conferences;
};

const mapConferencesToEvents = (conferences: Conference[]): Event[] => {
  return conferences.map(conference => ({
    id: conference.id,
    title: conference.title,
    start: conference.start_time,
    end: conference.end_time,
  }));
};

const Calendar = ({locale}: {locale: keyof typeof Culture}) => {
  const setCurrentConferences = useConferenceStore(
    state => state.setConferences,
  );
  const currentConferences = useConferenceStore(state => state.conferences);

  const renderEventContent = (eventInfo: any) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  const handleDatesSet = async (dateInfo: {start: Date; end: Date}) => {
    const conferences = await getConferencesByDate(
      dateInfo.start,
      dateInfo.end,
    );

    setCurrentConferences(conferences);
  };

  const getEventDates = (events: Conference[]): Set<string> => {
    const eventDates = new Set<string>();
    events.forEach(event => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);

      const startDate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      );
      const endDate = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
      );

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        eventDates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return eventDates;
  };

  const eventDates = useMemo(
    () => getEventDates(currentConferences),
    [currentConferences],
  );

  const dayCellClassNames = (arg: {date: Date}) => {
    const dateString = arg.date.toISOString().split('T')[0];
    return eventDates.has(dateString) ? 'has-event' : '';
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      locale={locale === 'nl' ? nlLocale : 'en'}
      locales={[nlLocale]}
      events={mapConferencesToEvents(currentConferences)}
      datesSet={handleDatesSet}
      eventContent={renderEventContent}
      headerToolbar={{
        left: 'title',
        right: 'prev,next',
      }}
      height="auto"
      dayCellClassNames={dayCellClassNames}
    />
  );
};

const CalendarItem = ({
  conference,
  locale,
}: {
  conference: Conference;
  locale: keyof typeof Culture;
}) => {
  const {t} = useTranslation('website');
  const dateFnsLocale = getDateFnsLocale(locale);

  return (
    <Container
      className="flex flex-col flex-grow bg-slate-100"
      data-href={conference.conference_address}
      data-target="blank"
    >
      <Container className="p-6">
        <Container className="text-xl font-semibold mb-2">
          {conference.title}
        </Container>
        <Container className="mb-4">
          <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-sm mr-2">
            {format(new Date(conference.start_time), 'eeee dd MMMM', {
              locale: dateFnsLocale,
            })}
          </span>
          <span className="bg-ps-lightblue-500 text-white py-1 px-2 rounded text-sm">
            {format(new Date(conference.start_time), 'hh:mm', {
              locale: dateFnsLocale,
            })}
          </span>
        </Container>
        <Container className="text-gray-600 mb-4">
          {truncateText(conference.purpose, 200)}
        </Container>
        <Button
          title={t('calendar.viewWebinar')}
          href={conference.conference_address}
          className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          target="_blank"
        />
      </Container>
    </Container>
  );
};

const CalendarList = ({locale}: {locale: keyof typeof Culture}) => {
  const {t} = useTranslation('website');
  const currentConferences = useConferenceStore(state => state.conferences);
  const dateFnsLocale = getDateFnsLocale(locale);

  if (currentConferences.length === 0) {
    return (
      <Container className="p-6 pt-0">
        <Container className="text-xl font-semibold mb-2">
          {t('calendar.noEvents')}
        </Container>
      </Container>
    );
  } else {
    return (
      <>
        {currentConferences.map((conference, index) => (
          <React.Fragment key={conference.id}>
            <Container className={`p-6 ${index === 0 ? 'pt-0' : ''}`}>
              <Container className="text-lg font-semibold mb-2">
                {conference.title}
              </Container>
              <Container className="mb-4">
                <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-sm mr-2">
                  {format(new Date(conference.start_time), 'eeee dd MMMM', {
                    locale: dateFnsLocale,
                  })}
                </span>
                <span className="bg-ps-lightblue-500 text-white py-1 px-2 rounded text-sm">
                  {format(new Date(conference.start_time), 'hh:mm', {
                    locale: dateFnsLocale,
                  })}
                </span>
              </Container>
              <Container className="text-gray-600 mb-4">
                {truncateText(conference.purpose, 240)}
              </Container>
              <Button
                title={t('calendar.readMore')}
                href={conference.conference_address}
                className="inline-block text-sm text-gray-600 hover:underline transition duration-300"
                target="_blank"
              />
            </Container>
            <>
              {index !== currentConferences.length - 1 && (
                <hr className="ml-6" />
              )}
            </>
          </React.Fragment>
        ))}
      </>
    );
  }
};

export {Calendar, CalendarItem, CalendarList};
