import logo1 from '@/public/images/logos/1.png';
import logo2 from '@/public/images/logos/2.png';
import logo3 from '@/public/images/logos/3.png';
import logo4 from '@/public/images/logos/4.png';
import logo5 from '@/public/images/logos/5.png';
import Image from 'next/image';

const Logos = () => {
  return (
    <section className="bg-ps-blue-100">
      <div className="max-w-screen-xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
            <Image
              alt="logo1"
              title="logo1"
              src={logo1.src}
              width={160}
              height={160}
              className="filter brightness-0 saturate-100 opacity-70"
            />
          </div>
          <div className="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
            <Image
              alt="logo1"
              title="logo1"
              src={logo2.src}
              width={160}
              height={160}
              className="filter brightness-0 saturate-100 opacity-70"
            />
          </div>
          <div className="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
            <Image
              alt="logo1"
              title="logo1"
              src={logo3.src}
              width={160}
              height={160}
              className="filter brightness-0 saturate-100 opacity-70"
            />
          </div>
          <div className="flex items-center justify-center col-span-1 md:col-span-3 lg:col-span-1">
            <Image
              alt="logo1"
              title="logo1"
              src={logo4.src}
              width={160}
              height={160}
              className="filter brightness-0 saturate-100 opacity-70"
            />
          </div>
          <div className="flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-1">
            <Image
              alt="logo1"
              title="logo1"
              src={logo5.src}
              width={160}
              height={160}
              className="filter brightness-0 saturate-100 opacity-70"
            />
          </div>
        </div>
      </div>
    </section>

    // <div className="w-full flex flex-wrap gap-14 justify-center">
    //   <div className="w-40 h-40 relative">

    //   </div>
    //   <div className="w-40 h-40 relative">
    //     <Image
    //       alt="logo2"
    //       title="logo2"
    //       src={logo2.src}
    //       width={160}
    //       height={160}
    //       className="object-contain w-full h-full filter brightness-0 saturate-100"
    //     />
    //   </div>
    //   <div className="w-40 h-40 relative">
    //     <Image
    //       alt="logo3"
    //       title="logo3"
    //       src={logo3.src}
    //       width={160}
    //       height={160}
    //       className="object-contain w-full h-full filter brightness-0 saturate-100"
    //     />
    //   </div>
    //   <div className="w-40 h-40 relative">
    //     <Image
    //       alt="logo4"
    //       title="logo4"
    //       src={logo4.src}
    //       width={160}
    //       height={160}
    //       className="object-contain w-full h-full filter brightness-0 saturate-100"
    //     />
    //   </div>
    //   <div className="w-40 h-40 relative">
    //     <Image
    //       alt="logo5"
    //       title="logo5"
    //       src={logo5.src}
    //       width={160}
    //       height={160}
    //       className="object-contain w-full h-full filter brightness-0 saturate-100"
    //     />
    //   </div>
    // </div>
  );
};

export default Logos;
