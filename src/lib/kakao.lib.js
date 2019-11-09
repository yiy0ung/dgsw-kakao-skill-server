
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
