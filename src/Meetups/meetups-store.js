import { writable } from "svelte/store";

const meetups = writable([]);

const customMeetupsStore = {
  subscribe: meetups.subscribe,
  setMeetups: initialMeetups => {
    meetups.set(initialMeetups);
  },
  addMeetup: meetupData => {
    const newMeetup = {
      id: Math.random().toString,
      ...meetupData
    };
    meetups.update(items => {
      return [newMeetup, ...items];
    });
  },
  updateMeetup: (id, meetupData) => {
    meetups.update(items => {
      const meetupIndex = items.findIndex(i => i.id === id);
      const updatedMeetup = { ...items[meetupIndex], ...meetupData };
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  deleteMeetup: id => {
    meetups.update(items => {
      return items.filter(item => item.id !== id);
    });
  },
  toggleFavorite: id => {
    meetups.update(items => {
      const updatedMeetup = { ...items.find(m => m.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetUpIndex = items.findIndex(m => m.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[meetUpIndex] = updatedMeetup;
      return updatedMeetups;
    });
  }
};

export default customMeetupsStore;
