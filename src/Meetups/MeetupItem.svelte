<script>
  import { createEventDispatcher } from "svelte";

  import meetups from "./meetups-store.js";
  import Button from "../UI/Button.svelte";
  import Badge from "../UI/Badge.svelte";
  export let id;
  export let title;
  export let subtitle;
  export let description;
  export let address;
  export let imageURL;
  export let email;
  export let isFavorite;
  const dispatch = createEventDispatcher();

  function toggleFavorite() {
    fetch(`https://svelte-meetups-1c01f.firebaseio.com/meetups//${id}.json`, {
      method: "PATCH",
      body: JSON.stringify({ isFavorite: !isFavorite }),
      headers: {
        contentType: "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Invalid response");
        }
        meetups.toggleFavorite(id);
        return res.json();
      })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }
</style>

<article>
  <header>
    <h1>
       {title}
      {#if isFavorite}
        <Badge>Favorite</Badge>
        <!-- content here -->
      {/if}

    </h1>
    <h2>{subtitle}</h2>
    <p>{address}</p>
  </header>
  <div class="image">
    <img src={imageURL} alt={title} />
  </div>
  <div class="content">
    <p>{description}</p>
  </div>
  <footer>
    <Button type="button" mode="outline" on:click={() => dispatch('edit', id)}>
      Edit
    </Button>
    <Button
      mode="outline"
      color={isFavorite ? null : 'success'}
      on:click={toggleFavorite}>
       {isFavorite ? 'Unfavorite' : 'Favorite'}
    </Button>
    <Button
      on:click={() => {
        dispatch('showDetails', id);
      }}>
      Show Details
    </Button>

  </footer>
</article>
