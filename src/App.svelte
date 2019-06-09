<script>
  import meetups from "./Meetups/meetups-store.js";
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";
  import LoadingSpinner from "./UI/LoadingSpinner.svelte";

  export let id;

  // let meetups

  let editMode = false;
  let editedId = null;
  let page = "overview";
  let isLoading = true;

  fetch("https://svelte-meetups-1c01f.firebaseio.com/meetups.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(" Invalid request");
      }
      return res.json();
    })
    .then(data => {
      const loadedMeetups = [];
      console.log(data);
      for (const key in data) {
        loadedMeetups.push({ id: key, ...data[key] });
      }
      console.log(loadedMeetups);
      setTimeout(() => {
        meetups.setMeetups(loadedMeetups.reverse());
        isLoading = false;
      }, 1000);
    })
    .catch(err => {
      isLoading = false;
      console.log(error);
    });

  function savedMeetup(event) {
    editMode = false;
    editedId = null;
  }

  function cancelEdit() {
    editMode = false;
    editedId = null;
  }

  function showDetails(event) {
    page = "details";
    id = event.detail;
  }

  function closeDetails() {
    page = "overview";
    id = null;
  }
  function startEdit(event) {
    editMode = true;
    editedId = event.detail;
  }
  function startAdd() {
    editMode = true;
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>

<Header />
<main>
  {#if page === 'overview'}
    <!-- content here -->

    <div class="meetup-controls">

      {#if editMode}
        <!-- content here -->
        <EditMeetup
          on:save={savedMeetup}
          on:cancel={cancelEdit}
          id={editedId} />
      {/if}

      {#if isLoading}
        <!-- content here -->
        <LoadingSpinner />
      {:else}
        <MeetupGrid
          meetups={$meetups}
          on:showDetails={showDetails}
          on:edit={startEdit}
          on:add={startAdd} />
      {/if}
    </div>
  {:else}
    <MeetupDetail {id} on:close={closeDetails} />
    <!-- else content here -->
  {/if}
</main>
