
exports.SimpleText = text => {
  const responseFormat = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
              text,
          },
      },
      ]
    }
  };

  return responseFormat;
};

exports.ListCard = (title, titleImgUrl = '', items) => {
  const responseFormat = {
    version: '2.0',
    template: {
      outputs: [
        {
          listCard: {
            header: {
              title,
              imageUrl: titleImgUrl,
            },
            items,
          },
        },
      ],
    },
  };

  return responseFormat; 
};

/**
 * @description 베이스 카드, 급식 케로셀
 */
exports.CarouselMeal = (items) => {
  const responseFormat = {
    version: '2.0',
    template: {
      outputs: [
        {
          carousel: {
            type: "basicCard",
            // header: {
            //   title,
            //   imageUrl: titleImgUrl,
            // },
            items,
          },
        },
      ],
    },
  };

  return responseFormat; 
};
