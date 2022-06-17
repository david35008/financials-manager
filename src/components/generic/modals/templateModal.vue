<template>
  <v-dialog
    v-if="!disabled"
    :value="isOpen"
    :max-width="widthComputed"
    :persistent="persistent"
    scrollable
    @click:outside="closeHandler"
  >
    <v-card
      :class="{
        greyHeader: greyHeader,
        greyBody: greyBody,
        greyActionPanel: greyActionPanel,
      }"
    >
      <v-card-title v-if="hasTitle">
        <div class="title">
          <slot name="title"></slot>
        </div>
        <template v-if="!persistent">
          <v-spacer></v-spacer>
          <v-icon class="close-modal-button" @click="closeHandler">
            mdi-close
          </v-icon>
        </template>
      </v-card-title>
      <v-divider v-if="hasTitle" class="ma-0" />

      <v-card-text class="ma-auto pa-0">
        <slot name="body"></slot>
      </v-card-text>

      <v-divider v-if="hasPanelAction" class="ma-0" />
      <v-card-actions v-if="hasPanelAction">
        <slot name="actions-button"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-container v-else>
    <slot name="body"></slot>
  </v-container>
</template>

<script>
export default {
	name: "TemplateModal",
	props: {
		isOpen: { type: Boolean, required: false, default: true },
		persistent: { type: Boolean, required: false },
		width: { type: String, required: false, default: null },
		unlimitedWidth: { type: Boolean, required: false },
		disabled: { type: Boolean, required: false },
		greyActionPanel: { type: Boolean, required: false },
		greyBody: { type: Boolean, required: false },
		greyHeader: { type: Boolean, required: false },
	},
	data() {
		return {};
	},
	computed: {
		widthComputed() {
			if (this.unlimitedWidth) {
				return undefined;
			}
			if (this.width) {
				return this.width;
			}
			return "500px";
		},
		hasTitle() {
			return !!this.$slots["title"];
		},
		hasPanelAction() {
			return !!this.$slots["actions-button"];
		},
	},
	methods: {
		closeHandler() {
			if (!this.persistent) {
				this.$emit("close");
			}
		},
		submitHandler() {
			this.$emit("submit");
		},
	},
};
</script>

<style lang="scss">
$bgColor:var(--v-grey-lighter);
.greyHeader {
	.v-card__title {
		background-color: $bgColor !important;
	}
}
.greyBody {
	.v-card__text {
		background-color: $bgColor !important;
	}
}
.greyActionPanel {
	.v-card__actions {
		background-color: $bgColor !important;
	}
}
</style>
<style lang="scss" scoped>
.title {
	word-break: break-word;
}
</style>