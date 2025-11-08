import mockData from '../models/leftSidebarModel.js';

export function getData(req, res) {
  res.status(200).json(mockData);
}