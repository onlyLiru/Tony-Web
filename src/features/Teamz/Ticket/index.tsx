import Summary from './Summary';
import Mint from './Mint';
import Compare from './Compare';

export const Ticket = () => {
  return (
    <section>
      <section
        className="flex justify-center max-sm:p-4 md:pb-10 bg-black bg-cover"
        style={{
          backgroundImage: "url('/images/teamz/2024/bg.png')",
          backgroundRepeat: 'no-repeat',
        }}
      >
        <section className="w-10/12 max-sm:w-full">
          <Summary />
          <Mint />
        </section>
      </section>
      <section className=" bg-[#242424] md:py-16">
        <section className="w-10/12 max-sm:w-full m-auto">
          <Compare />
        </section>
      </section>
    </section>
  );
};
