<script>
  export let controlType = false;
  export let id;
  export let label;
  export let rows = 0;
  export let value;
  export let type = "text";
  export let valid = true;
  export let validityMessage = "";
  export let touched = false;
  console.log(id, value);
</script>

<style>
  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus,
  textarea:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }
  .invalid {
    border-color: red;
    background: #fde3e3;
  }
  .error-message {
    color: red;
    margin: 0.25rem 0;
  }
</style>

<div class="form-control">
  <label for="Title">{label}</label>
  {#if controlType === 'textarea'}
    <!-- content here -->
    <textarea
      {rows}
      {id}
      {value}
      on:input
      class:invalid={!valid && touched}
      on:blur={() => (touched = true)} />
  {:else}
    <!-- else content here -->
    <input
      {type}
      {id}
      {value}
      on:input
      class:invalid={!valid && touched}
      on:blur={() => (touched = true)} />
  {/if}
  {#if validityMessage && !valid && touched}
    <!-- content here -->
    <p class="error-message"> {validityMessage} </p>
  {/if}
</div>
