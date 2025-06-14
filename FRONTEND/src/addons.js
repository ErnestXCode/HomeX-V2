

// 🖼️ Lazy Loaded Images with Preload

// *HouseCard.jsx*

// ```jsx
// import { useInView } from 'react-intersection-observer';

// const HouseCard = ({ house }) => {
//   const { ref, inView } = useInView({ rootMargin: '1000px' });

//   return (
//     <div ref={ref}>
//       {inView && (
//         <>
// <img loading="lazy" src=`/api/image/{house.images.outside}`} />
//           <img loading="lazy" src={`/api/image/house.images.inside` />
//         </>
//       )
//     </div>
//   );
// ;
// “`

// —

// 🔄 Virtualization (react-window)


// 🔁 Abstract Image URL Logic (For Future Cloudinary Swap)


// utils/imageUrl.js
// export const getImageUrl = (id) => `/api/image/{id}`;

// In components:
{/* <img src={getImageUrl(house.images.outside)} /> */}
// ```

// ---

// This setup supports:
// - 2 thumbnails per card (outside, inside)
// - Full metadata caching in React Query
// - Sharp-compressed GridFS storage
// - Lazy loading + virtualization
// - Aggressive cache headers
// - Abstracted image URL for easy future swap to Cloudinary

// Let me know if you want the folder structure or example detail view logic too.



// where should utils folder be 
// lazy loading and preloading why inside the card cmponent,
// i alredy am doing it in the div containing housecards that is responsile for fetching more