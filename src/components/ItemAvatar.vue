<script setup lang="ts">
import { Plus, MoreHorizontalIcon } from "lucide-vue-next"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
</script>

<template>
  <router-link to="/">
    <div class="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar class="size-10">
            <AvatarImage src="https://github.com/evilrabbit.png" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Evil Rabbit</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MailCheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterPlusIcon />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon class="mr-2 size-4" />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup v-model="label">
                    <DropdownMenuRadioItem value="personal">
                      Personal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">
                      Work
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">
                      Other
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
          <!-- <Button -->
          <!--   size="icon-sm" -->
          <!--   variant="outline" -->
          <!--   class="rounded-full" -->
          <!--   aria-label="Invite" -->
          <!-- > -->
          <!--   <Plus /> -->
          <!-- </Button> -->
        </ItemActions>
      </Item>
    </div>
  </router-link>
</template>
