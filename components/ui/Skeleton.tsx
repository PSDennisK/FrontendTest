import {Container} from '@/components/ui/Layout';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingContentItemHolder = ({amount}) => {
  const loadCards = Array(amount).fill(1);

  return loadCards.map((_, i) => (
    <Container
      className="ggroup flex flex-col rounded-xl bg-white shadow-xl"
      key={i}
    >
      <Container className="flex min-h-48 justify-center items-center rounded-t-xl overflow-hidden">
        <Skeleton
          className="rounded-t-xl min-h-48 h-48 w-full object-cover"
          width={365}
          height={192}
        />
      </Container>
      <Container className="flex flex-col overflow-hidden p-8">
        <Skeleton height={20} width={200} className="mb-1 lg:mb-1.5 -mx-1" />
      </Container>
    </Container>
  ));
};

const LoadingFilterHolder = ({amount}) => {
  const loadCards = Array(amount).fill(1);

  return loadCards.map((_, i) => (
    <Container
      className="flex w-full items-center mb-6 flex-wrap select-none"
      key={i}
    >
      <Skeleton
        className="flex max-w-full items-start justify-between cursor-pointer grow mb-2"
        height={28}
        width={140}
      />

      <Container className="basis-full border-t overflow-x-auto transition-all select-text max-h-32 pt-2">
        <Skeleton
          className="flex items-center text-sm ml-1 mb-1"
          height={20}
          width={150}
        />
        <Skeleton
          className="flex items-center text-sm ml-1 mb-1"
          height={20}
          width={150}
        />
        <Skeleton
          className="flex items-center text-sm ml-1 mb-1"
          height={20}
          width={150}
        />
        <Skeleton
          className="flex items-center text-sm ml-1 mb-1"
          height={20}
          width={150}
        />
      </Container>
    </Container>
  ));
};

const LoadingProductHolder = ({amount}) => {
  const loadCards = Array(amount).fill(1);

  return loadCards.map((_, i) => (
    <Container
      className="group flex flex-col rounded-xl bg-white shadow-xl"
      key={i}
    >
      <Container className="flex min-h-48 mt-8 justify-center items-center rounded-t-xl overflow-hidden">
        <Skeleton className="mx-auto" height={160} width={160} />
      </Container>

      <Container className="flex flex-col relative overflow-hidden h-48 p-8">
        <Container className="text-xl font-bold mb-4">
          <Skeleton height={20} width={220} />
          <Skeleton height={20} width={220} />
        </Container>
        <Container className="text-base absolute right-8 bottom-8">
          <Skeleton height={20} width={100} />
        </Container>
      </Container>
    </Container>
  ));
};

export {LoadingContentItemHolder, LoadingFilterHolder, LoadingProductHolder};
