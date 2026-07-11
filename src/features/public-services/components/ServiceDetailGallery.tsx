import { Image } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import fallbackServiceImage from '@/assets/appointment-hero.png';

import { getServiceDetailGalleryImages } from '../constants/public-service-detail-mock-data';
import type { PublicServiceCardModel } from '../types/public-service-type';

interface ServiceDetailGalleryProps {
  service: PublicServiceCardModel;
}

export function ServiceDetailGallery({ service }: ServiceDetailGalleryProps) {
  const galleryImages = useMemo(() => {
    const serviceImages = getServiceDetailGalleryImages(service);

    return serviceImages.length ? serviceImages : [fallbackServiceImage];
  }, [service]);
  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  useEffect(() => {
    setActiveImage(galleryImages[0]);
  }, [galleryImages]);

  return (
    <div className="service-detail-gallery">
      <div className="service-detail-gallery-main">
        <Image
          alt={service.name}
          className="service-detail-gallery-image"
          preview={{ src: activeImage }}
          src={activeImage}
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="service-detail-thumbnails">
          {galleryImages.map((imageUrl, index) => (
            <button
              aria-label={`Xem ảnh dịch vụ ${index + 1}`}
              className={imageUrl === activeImage ? 'active' : ''}
              key={`${imageUrl}-${index}`}
              onClick={() => setActiveImage(imageUrl)}
              type="button"
            >
              <img alt={`${service.name} ${index + 1}`} src={imageUrl} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
