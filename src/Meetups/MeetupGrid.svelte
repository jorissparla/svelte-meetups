<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  const dispatch = createEventDispatcher();
  import MeetupItem from "./MeetupItem.svelte";
  import MeetupFilter from "./MeetupFilter.svelte";
  import Button from "../UI/Button.svelte";
  export let meetups;

  let favsOnly = false;
  function setFilter(event) {
    favsOnly = event.detail === 1;
  }

  $: filteredMeetups = favsOnly ? meetups.filter(m => m.isFavorite) : meetups;
</script>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }
  #no-meetups {
    margin: 1rem;
  }
  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<section id="meetup-controls">

  <MeetupFilter on:select={setFilter} />
  <Button
    on:click={() => {
      dispatch('add');
    }}>
    New Meetup
  </Button>
</section>
{#if filteredMeetups.length === 0}
  <!-- content here -->
  <p id="no-meetups">No Meetups found..</p>
{/if}
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{ duration: 500 }}>
      <MeetupItem
        id={meetup.id}
        imageURL={meetup.imageURL}
        title={meetup.title}
        subtitle={meetup.subtitle}
        description={meetup.description}
        address={meetup.address}
        email={meetup.contactEmail}
        isFavorite={meetup.isFavorite}
        on:showDetails
        on:edit />
    </div>
  {/each}
</section>
