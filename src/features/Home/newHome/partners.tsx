import PartnersRow from './partnerRow';

const PartnersView = () => {
  const partnersArr = [
    {
      topImgUrl: '/images/home/new/partners/1top.jpg',
      swiperArr: [
        {
          imgUrl:
            'https://framerusercontent.com/images/KVZ3Pt9Ley7gMNjfDoZgqFjc.png?scale-down-to=1024',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/L6VsuFw3pVYZCuMK6lJh3bqxYI.jpeg?scale-down-to=1024',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/RNx5kKwySKHU6JCtB9I1qSm3Qk.png?scale-down-to=2048',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/oVM3NxzdyT3UVs9ofhgY8EBAZe8.png',
        },
      ],
      rowClassName: 'bg-[#FFF]',
      link: 'https://twitter.com/une_kumamon_nft?s=21',
    },
    // {
    //   topImgUrl:
    //     'https://framerusercontent.com/images/bLzeUrG6LaB4nDuCPcMZqdxwU.png?scale-down-to=512',
    //   swiperArr: [
    //     {
    //       imgUrl:
    //         'https://framerusercontent.com/images/CSJKlBHZXERHfm2fcpzwkBcA1FE.png',
    //     },
    //     {
    //       imgUrl:
    //         'https://framerusercontent.com/images/hSHjMlNnOnzmaCWjVjTdNSRJoW8.png?scale-down-to=512',
    //     },
    //     {
    //       imgUrl:
    //         'https://framerusercontent.com/images/IPEdwmf8WJSB85N7fuSxXIczlY.png?scale-down-to=1024',
    //     },
    //   ],
    //   rowClassName: 'bg-[#000]',
    // },
    {
      topImgUrl:
        'https://framerusercontent.com/images/LNeIlZMjy2VCkQSJnzvJc4U.png',
      swiperArr: [
        {
          imgUrl:
            'https://framerusercontent.com/images/m4xyS9fwChuVndpJKLiC98fHAI.png?scale-down-to=2048',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/STp2l3nmf2tvfMNn1iZ7aYIjHc.png?scale-down-to=2048',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/3zLrmtfgYAHi8D2UrJQ7ZYGUHQ.png?scale-down-to=2048',
        },
      ],
      rowClassName: 'bg-[#5c0707]',
      link: 'https://www.youtube.com/watch?v=kcJeVo9RjQg',
    },
    {
      topImgUrl:
        'https://framerusercontent.com/images/3zEhcqSSDbiLwbROESGJkshNI.png',
      swiperArr: [
        {
          imgUrl:
            'https://framerusercontent.com/images/4NeN2R5RFex7XE5emheFLulWab4.jpeg',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/TgKIyrukgFCjV5wbMJGVpvs2tQ.png?scale-down-to=2048',
        },
      ],
      rowClassName: 'bg-[#4d3939]',
      link: 'https://twitter.com/hanazawa_staff/status/1532965353097416704?s=20',
    },
    {
      topImgUrl:
        'https://framerusercontent.com/images/D7sua50S76uizAPeNLywtHjzDNY.png',
      swiperArr: [
        {
          imgUrl:
            'https://framerusercontent.com/images/M38Vzjwaq2eqI4yk9hZdPoUMe3w.png',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/YeQrroUVESIvCTg2Edd3IcyB1g.png?scale-down-to=1024',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/pla0iJArWnpI8bAAxVpykIBRwLE.png?scale-down-to=512',
        },
        {
          imgUrl:
            'https://framerusercontent.com/images/4GKLwj1Ir75JEMyJivaMSzlUOo.png?scale-down-to=512',
        },
      ],
      rowClassName: 'bg-[#000]',
      link: 'https://twitter.com/belladonna_nft?s=21',
    },
    // {
    //   topImgUrl:
    //     'https://framerusercontent.com/images/zDj2TruUtBgqWVZTeYib7FpvlEk.png',
    //   swiperArr: [
    //     {
    //       imgUrl:
    //         'https://framerusercontent.com/images/aXzSYE2rilciAXrNP9MUYru26ow.png?scale-down-to=1024',
    //     },
    //     {
    //       imgUrl:
    //         'https://framerusercontent.com/images/olgphuRfuOiV8aVfJ3qhs8Zs.png',
    //     },
    //     {
    //       imgUrl:
    //         'https://framerusercontent.com/images/sDKygQ919suj2XDsMcwBcAYVBE.png?scale-down-to=512',
    //     },
    //   ],
    //   rowClassName: 'bg-[#ad96ff]',
    // },
  ];
  return (
    <div className="grid grid-cols-2 llg:grid-cols-1 gap-[30px]">
      {partnersArr?.map(
        (
          item: {
            link: string | undefined;
            topImgUrl?: string;
            rowClassName?: string;
            swiperArr: { imgUrl: string }[];
          },
          index: number,
        ) => (
          <div className="" key={index}>
            <PartnersRow
              topImgUrl={item?.topImgUrl}
              swiperArr={item?.swiperArr}
              rowClassName={item?.rowClassName}
              link={item?.link}
            ></PartnersRow>
          </div>
        ),
      )}
    </div>
  );
};
export default PartnersView;
