import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ResponsiveImage,
  generateCloudinarySrcSet,
  isCloudinaryUrl,
} from './image';

describe('isCloudinaryUrl', () => {
  it('should return true for valid Cloudinary URLs', () => {
    const validUrl =
      'https://res.cloudinary.com/shinabr2/image/upload/v1670242747/Public/Images/TG5-1024x576.webp';
    expect(isCloudinaryUrl(validUrl)).toBe(true);
  });

  it('should return false for non-Cloudinary URLs', () => {
    const urls = [
      'https://example.com/image.jpg',
      'https://cloudinary.com/not-upload/image.jpg',
      'https://res.cloudinary.com/image.jpg', // missing /upload/
      '',
    ];

    urls.forEach(url => {
      expect(isCloudinaryUrl(url)).toBe(false);
    });
  });
});

describe('generateCloudinarySrcSet', () => {
  it('should generate correct srcSet for Cloudinary URL with version', () => {
    const url =
      'https://res.cloudinary.com/shinabr2/image/upload/v1670242747/Public/Images/TG5-1024x576.webp';
    const widths = [400, 800];

    const expected = [
      'https://res.cloudinary.com/shinabr2/image/upload/f_auto,q_auto,w_400/v1670242747/Public/Images/TG5-1024x576.webp 400w',
      'https://res.cloudinary.com/shinabr2/image/upload/f_auto,q_auto,w_800/v1670242747/Public/Images/TG5-1024x576.webp 800w',
    ].join(',\n    ');

    expect(generateCloudinarySrcSet(url, widths)).toBe(expected);
  });

  it('should generate correct srcSet for Cloudinary URL without version', () => {
    const url =
      'https://res.cloudinary.com/shinabr2/image/upload/Public/Images/TG5-1024x576.webp';
    const widths = [400, 800];

    const expected = [
      'https://res.cloudinary.com/shinabr2/image/upload/f_auto,q_auto,w_400/Public/Images/TG5-1024x576.webp 400w',
      'https://res.cloudinary.com/shinabr2/image/upload/f_auto,q_auto,w_800/Public/Images/TG5-1024x576.webp 800w',
    ].join(',\n    ');

    expect(generateCloudinarySrcSet(url, widths)).toBe(expected);
  });
});

describe('ResponsiveImage Component', () => {
  it('should render with srcSet for Cloudinary URLs', () => {
    const url =
      'https://res.cloudinary.com/shinabr2/image/upload/v1670242747/Public/Images/TG5-1024x576.webp';
    render(<ResponsiveImage src={url} alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', url);
    expect(img).toHaveAttribute('srcSet');
    expect(img.getAttribute('srcSet')).toContain('w_400');
  });

  it('should render without srcSet for non-Cloudinary URLs', () => {
    const url = 'https://example.com/image.jpg';
    render(<ResponsiveImage src={url} alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', url);
    expect(img).not.toHaveAttribute('srcSet');
  });

  it('should pass through additional props', () => {
    render(
      <ResponsiveImage
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-class"
        imgProps={{
          id: 'test-id',
        }}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('custom-class');
    expect(img).toHaveAttribute('id', 'test-id');
  });

  it('should use custom widths when provided', () => {
    const url =
      'https://res.cloudinary.com/shinabr2/image/upload/v1670242747/Public/Images/TG5-1024x576.webp';
    const customWidths = [300, 600];

    render(
      <ResponsiveImage src={url} alt="Test image" widths={customWidths} />
    );

    const img = screen.getByAltText('Test image');
    const srcSet = img.getAttribute('srcSet') || '';

    expect(srcSet).toContain('w_300');
    expect(srcSet).toContain('w_600');
    expect(srcSet).not.toContain('w_400');
  });
});
