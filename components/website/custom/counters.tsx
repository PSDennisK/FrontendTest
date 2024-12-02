'use client';

import {Container, Section} from '@/components/ui/Layout';
import {useTranslation} from '@/i18n/client';
import {LocaleTypes} from '@/i18n/settings';
import {UmbracoContentItem, UmbracoProperties} from '@/types';
import {useParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

const AnimatedCounter = ({
  end,
  duration,
  startCounting,
}: {
  end: number;
  duration: number;
  startCounting: boolean;
}) => {
  const [count, setCount] = useState(0);
  const locale = useParams()?.locale as LocaleTypes;
  const {i18n} = useTranslation(locale, 'common');

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // 60 FPS

    if (startCounting) {
      const timer = setInterval(() => {
        try {
          start += increment;
          if (start >= end) {
            clearInterval(timer);
            setCount(end);
          } else {
            setCount(Math.floor(start));
          }
        } catch (error) {
          clearInterval(timer);
          console.error(error);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [end, duration, startCounting]);

  return (
    <span>{new Intl.NumberFormat(i18n?.language || 'en').format(count)}</span>
  );
};

const CounterBlock = ({
  title,
  end,
  Icon,
}: {
  title: string;
  end: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => {
  const [startCounting, setStartCounting] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true);
          observer.unobserve(entry.target);
        }
      },
      {threshold: 0.1}, // Start when 10% of the element is visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  return (
    <div ref={counterRef} className="overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="px-4 py-2 flex flex-col items-center">
          {/* <Icon className="h-8 w-8 text-gray-400 mb-2" /> */}
          <p className="text-4xl font-bold text-ps-blue-800">
            <AnimatedCounter
              end={end}
              duration={2000}
              startCounting={startCounting}
            />
          </p>
          <p className="text-sm text-ps-blue-800 uppercase tracking-wide mt-1">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatsCounter = ({properties}: {properties: UmbracoProperties}) => {
  const counterItems = properties?.counterItems?.items;

  if (!counterItems) {
    return null;
  }

  return (
    <Section className="w-full bg-ps-blue-100 border border-t-ps-blue-50">
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Container className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {counterItems?.map((item: UmbracoContentItem) => (
            <CounterBlock
              key={item.content.id}
              title={item.content.properties.title ?? ''}
              end={item.content.properties.number ?? 0}
              Icon={
                item.content.properties.icon as React.ComponentType<
                  React.SVGProps<SVGSVGElement>
                >
              }
            />
          ))}
        </Container>
      </Container>
    </Section>
  );
};

export default StatsCounter;
