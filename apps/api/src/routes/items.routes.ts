import { Router } from 'express';
import type { Request, Response } from 'express';

const router: Router = Router();

// GET /api/v1/items
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Item 1', description: 'First item' },
      { id: 2, name: 'Item 2', description: 'Second item' }
    ],
    message: 'Items fetched successfully'
  });
});

// GET /api/v1/items/:id
router.get('/:id', (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string);
  
  if (itemId === 1) {
    res.json({
      success: true,
      data: { id: 1, name: 'Item 1', description: 'First item' },
      message: 'Item fetched successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
});

// POST /api/v1/items
router.post('/', (req: Request, res: Response) => {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      error: 'Name and description are required'
    });
  }
  
  res.status(201).json({
    success: true,
    data: { id: 3, name, description },
    message: 'Item created successfully'
  });
});

// PUT /api/v1/items/:id
router.put('/:id', (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string);
  const { name, description } = req.body;
  
  if (itemId === 1) {
    res.json({
      success: true,
      data: { id: 1, name: name || 'Updated Item', description: description || 'Updated description' },
      message: 'Item updated successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
});

// DELETE /api/v1/items/:id
router.delete('/:id', (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string);
  
  if (itemId === 1) {
    res.status(204).send();
  } else {
    res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
});

export default router;