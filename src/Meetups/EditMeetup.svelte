<script>
  import { createEventDispatcher } from "svelte";
  import meetups from "./meetups-store.js";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../helpers/validation.js";
  const dispatch = createEventDispatcher();

  export let id = null;
  let title = "";
  let subtitle = "";
  let description = "";
  let address = "";
  let imageURL = "";
  let email = "";

  if (id) {
    const unsubscribe = meetups.subscribe(items => {
      const foundMeetup = items.find(item => item.id === id);
      if (foundMeetup) {
        ({
          title,
          subtitle,
          description,
          imageURL,

          address
        } = foundMeetup);
        email = foundMeetup.contactEmail;
      }
    });
    unsubscribe();
  }

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: descriptionValid = !isEmpty(description);
  $: emailValid = isValidEmail(email);
  $: addressValid = !isEmpty(address);
  $: imageURLValid = !isEmpty(imageURL);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    descriptionValid &&
    emailValid &&
    addressValid &&
    imageURLValid;

  function submitForm() {
    const meetupData = {
      // id: Math.random().toString(),
      title,
      subtitle,
      description,
      address,
      imageURL,
      contactEmail: email
      // isFavorite: false
    };
    if (id) {
      fetch(`https://svelte-meetups-1c01f.firebaseio.com/meetups//${id}.json`, {
        method: "PATCH",
        body: JSON.stringify({ ...meetupData }),
        headers: {
          contentType: "application/json"
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Invalid response");
          }
          meetups.updateMeetup(id, meetupData);
          return res.json();
        })
        .then(data => console.log(data))
        .catch(err => console.log(err));
    } else {
      fetch("https://svelte-meetups-1c01f.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...meetupData, isFavorite: false }),
        headers: {
          contentType: "application/json"
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Invalid response");
          }
          return res.json();
        })
        .then(data => {
          meetups.addMeetup({
            ...meetupData,
            isFavorite: false,
            id: data.name
          });
        })
        .catch(err => console.log(err));
    }
    dispatch("save");
  }
  function cancelForm() {
    dispatch("cancel");
  }
  function deleteMeetup() {
    fetch(`https://svelte-meetups-1c01f.firebaseio.com/meetups//${id}.json`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Invalid response");
        }
        meetups.deleteMeetup(id);
        return res.json();
      })
      .then(data => console.log(data))
      .catch(err => console.log(err));
    dispatch("cancel");
  }
</script>

<style>
  form {
    width: 100%;
  }
</style>

<Modal title="Meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      type="text"
      value={title}
      valid={titleValid}
      validityMessage="Enter a valid title"
      on:input={event => (title = event.target.value)} />
    <TextInput
      id="subtitle"
      label="subtitle"
      type="text"
      value={subtitle}
      valid={subtitleValid}
      validityMessage="Enter a valid Subtitle"
      on:input={event => (subtitle = event.target.value)} />
    <TextInput
      id="address"
      label="address"
      type="text"
      value={address}
      valid={addressValid}
      validityMessage="Enter a valid address"
      on:input={event => (address = event.target.value)} />

    <div class="form-control">
      <TextInput
        id="imageURL"
        label="imageURL"
        type="text"
        value={imageURL}
        valid={imageURLValid}
        validityMessage="Enter a valid Image URL"
        on:input={event => (imageURL = event.target.value)} />
      <TextInput
        id="email"
        label="email"
        type="email"
        value={email}
        valid={emailValid}
        validityMessage="Enter a valid emailL"
        on:input={event => (email = event.target.value)} />
      <TextInput
        id="description"
        label="description"
        type="text"
        controlType="textarea"
        value={description}
        valid={descriptionValid}
        validityMessage="Enter a valid description"
        on:input={event => (description = event.target.value)} />
    </div>
  </form>
  <div slot="footer">
    <Button disabled={!formIsValid} type="button" on:click={submitForm}>
      Save
    </Button>
    {#if id}
      <!-- content here -->
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
    <Button type="button" on:click={cancelForm}>Cancel</Button>
  </div>

</Modal>
