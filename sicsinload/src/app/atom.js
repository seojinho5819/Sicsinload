import { atom, selector } from 'recoil';

const reviewList = atom({
    key : 'reviews',
    default : ''
});

export const addReview = selector({
    key : 'addReview',
    get : ({get}) => {
        const a = get(reviews);
    }
})