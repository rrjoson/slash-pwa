<script>
  import TodoItem from "./TodoItem.svelte";
  import { db } from "./firebase";
  import { collectionData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";

  // User ID passed from parent
  export let uid;

  // Form Text
  let text = "some task";

  // Query requires an index, see screenshot below
  const query = db
    .collection("todos")
    .where("uid", "==", uid)
    .orderBy("created");

  const todos = collectionData(query, "id").pipe(startWith([]));

  function add() {
    db.collection("todos").add({
      uid,
      text,
      complete: false,
      created: Date.now()
    });
    text = "";
  }

  function updateStatus(event) {
    const { id, newStatus } = event.detail;
    db.collection("todos")
      .doc(id)
      .update({ complete: newStatus });
  }

  function removeItem(event) {
    const { id } = event.detail;
    db.collection("todos")
      .doc(id)
      .delete();
  }

  let hasTimer = false;
  let activeId = null;
  let activeText;
  let seconds = 0;
  let timer;

  function complete(event) {
    clearInterval(timer);
    hasTimer = false;
    // Update firebase
    db.collection("todos")
      .doc(activeId)
      .update({ complete: true, time: seconds });
    seconds = 0;
  }

  function startItem(event) {
    const { id, text } = event.detail;
    console.log(event);

    db.collection("todos")
      .doc(id)
      .update({ time: 0 });
    activeId = id;
    activeText = text;
    hasTimer = true;
    timer = setInterval(() => {
      seconds += 1;
    }, 1000);
  }

  function sec2time(timeInSeconds) {
    var pad = function(num, size) {
        return ("000" + num).slice(size * -1);
      },
      time = parseFloat(timeInSeconds).toFixed(3),
      hours = Math.floor(time / 60 / 60),
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time - minutes * 60);

    return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
  }
</script>

{#if !hasTimer}
  <style>
    input {
      display: block;
    }
  </style>
  <ul>
    {#each $todos as todo}
      <TodoItem
        {...todo}
        on:remove={removeItem}
        on:start={startItem}
        on:toggle={updateStatus} />
    {/each}
  </ul>

  <input bind:value={text} />

  <button on:click={add}>Add Task</button>
{:else}
  <style>
    section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: fixed;
      background: black;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    h1 {
      color: white;
      margin-bottom: 10px;
    }
    div {
      color: white;
      margin-bottom: 10px;
    }
  </style>
  <section>
    <h1>{activeText}</h1>
    <div>{sec2time(seconds)}</div>
    <button on:click={complete}>Complete Task</button>
  </section>
{/if}
