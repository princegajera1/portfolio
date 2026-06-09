import { Helmet } from 'react-helmet-async';
import BookingPage from '../components/booking/BookingPage';

export default function Booking() {
  return (
    <>
      <Helmet>
        <title>Book a Meeting — Prince Gajera | Frontend Developer</title>
        <meta
          name="description"
          content="Schedule a 30-minute free consultation with Prince Gajera — Frontend Developer. Discuss your project, tech stack, and next steps."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>
      <BookingPage />
    </>
  );
}
