import {NextResponse} from 'next/server';

export async function GET() {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // Convert to Unix timestamps (seconds)
  const startTimeFrom = Math.floor(firstDayOfMonth.getTime() / 1000);
  const startTimeTo = Math.floor(lastDayOfMonth.getTime() / 1000);

  const url = new URL('https://www.bigmarker.com/api/v1/conferences');
  url.searchParams.append('start_time', startTimeFrom.toString());
  url.searchParams.append('end_time', startTimeTo.toString());

  const headers = new Headers({
    'API-KEY': process.env.NEXT_PUBLIC_BIGMARKER_API_KEY || '',
  });

  try {
    const response = await fetch(url.toString(), {headers});

    if (!response.ok) {
      throw new Error('Netwerk respons was niet ok');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fout bij het ophalen van conferenties:', error);
    return NextResponse.json(
      {error: 'Er is een fout opgetreden bij het ophalen van de conferenties'},
      {status: 500},
    );
  }
}
