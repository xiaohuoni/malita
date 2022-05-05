import { Request, Response } from 'express';

export default {
  'GET /mock/hello': {
    text: 'Malita',
  },
  'POST /mock/list': (req: Request, res: Response) => {
    const dataSource = [
      {
        id: 1,
        title: 'Title 1',
      },
      {
        id: 2,
        title: 'Title 2',
      },
      {
        id: 3,
        title: 'Title 3',
      },
      {
        id: 4,
        title: 'Title 4',
      },
      {
        id: 5,
        title: 'Title 5',
      },
    ];
    const { body } = req;

    const { pageSize, offset } = body;
    return res.json({
      total: dataSource.length,
      data: dataSource.slice(offset, offset + pageSize),
    });
  },
};
